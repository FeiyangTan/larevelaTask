import { useCallback, useEffect, useState } from 'react';
import {
  createWalletClient,
  custom,
  formatUnits,
  isAddress,
  parseUnits,
  type Address,
  type Hash,
} from 'viem';
import { CHAIN, CHAIN_ID, CHAIN_NAME, CONTRACT_ADDRESS } from '../blockchain/config';
import {
  readTokenBalance,
  readTokenDecimals,
  readTokenName,
  readTokenSymbol,
  waitForTx,
  writeTransfer,
} from '../blockchain/contract';

export type TxStatus = 'idle' | 'pending' | 'success' | 'error';

function parseChainId(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    if (value.startsWith('0x')) return parseInt(value, 16);
    return Number(value);
  }
  return 0;
}

export function useWallet() {
  const [address, setAddress] = useState<Address | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [tokenBalance, setTokenBalance] = useState<bigint | null>(null);
  const [formattedBalance, setFormattedBalance] = useState('—');
  const [txStatus, setTxStatus] = useState<TxStatus>('idle');
  const [txHash, setTxHash] = useState<Hash | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isConnected = !!address;
  const isCorrectNetwork = chainId === CHAIN_ID;

  const getWalletClient = useCallback(() => {
    const provider = typeof window !== 'undefined' ? window.ethereum : undefined;
    if (!provider) return null;

    return createWalletClient({
      chain: CHAIN,
      transport: custom(provider),
    });
  }, []);

  const loadTokenData = useCallback(async (account: Address) => {
    const [name, symbol, decimals, balance] = await Promise.all([
      readTokenName(),
      readTokenSymbol(),
      readTokenDecimals(),
      readTokenBalance(account),
    ]);

    setTokenName(name);
    setTokenSymbol(symbol);
    setTokenDecimals(decimals);
    setTokenBalance(balance);
    setFormattedBalance(formatUnits(balance, decimals));
  }, []);

  const refreshWalletState = useCallback(async (account: Address) => {
    setError(null);

    const provider = window.ethereum;
    if (!provider) {
      setError('No wallet found. Install MetaMask or another injected wallet.');
      return;
    }

    const currentChainId = parseChainId(await provider.request({ method: 'eth_chainId' }));
    setChainId(currentChainId);

    if (currentChainId !== CHAIN_ID) {
      setError(`Wrong network. Please switch to ${CHAIN_NAME} (chainId ${CHAIN_ID}).`);
      return;
    }

    await loadTokenData(account);
  }, [loadTokenData]);

  const connect = useCallback(async () => {
    setError(null);

    try {
      const provider = window.ethereum;
      if (!provider) {
        setError('No wallet found. Install MetaMask or another injected wallet.');
        return;
      }

      const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as Address[];
      const account = accounts?.[0];
      if (!account) {
        setError('No wallet account returned.');
        return;
      }

      setAddress(account);
      await refreshWalletState(account);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to connect wallet.');
    }
  }, [refreshWalletState]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
    setTokenBalance(null);
    setFormattedBalance('—');
    setTxHash(null);
    setTxStatus('idle');
    setError(null);
  }, []);

  const switchNetwork = useCallback(async () => {
    const provider = window.ethereum;
    if (!provider) {
      setError('No wallet found. Install MetaMask or another injected wallet.');
      return;
    }

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
      });

      if (address) {
        await refreshWalletState(address);
      }
    } catch (switchError) {
      const errorWithCode = switchError as { code?: number; message?: string };

      if (errorWithCode.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${CHAIN_ID.toString(16)}`,
                chainName: CHAIN.name,
                nativeCurrency: CHAIN.nativeCurrency,
                rpcUrls: CHAIN.rpcUrls.default.http,
                blockExplorerUrls: CHAIN.blockExplorers?.default
                    ? [CHAIN.blockExplorers.default.url]
                    : [],
              },
            ],
          });

          if (address) {
            await refreshWalletState(address);
          }
        } catch (addError) {
          setError(addError instanceof Error ? addError.message : 'Failed to add network.');
        }
      } else {
        setError(
            switchError instanceof Error ? switchError.message : 'Failed to switch network.',
        );
      }
    }
  }, [address, refreshWalletState]);

  const transfer = useCallback(
      async (to: string, amount: string) => {
        if (!address) {
          setError('Connect wallet first.');
          return;
        }

        if (!isCorrectNetwork) {
          setError(`Wrong network. Please switch to ${CHAIN_NAME}.`);
          return;
        }

        if (!isAddress(to)) {
          setError('Recipient address is invalid.');
          setTxStatus('error');
          return;
        }

        if (!amount || Number(amount) <= 0) {
          setError('Enter a valid token amount.');
          setTxStatus('error');
          return;
        }

        const walletClient = getWalletClient();
        if (!walletClient) {
          setError('Wallet client is not available.');
          return;
        }

        try {
          setError(null);
          setTxHash(null);
          setTxStatus('pending');

          const parsedAmount = parseUnits(amount, tokenDecimals);
          const hash = await writeTransfer(walletClient, address, to as Address, parsedAmount);
          setTxHash(hash);

          const receipt = await waitForTx(hash);
          if (receipt.status !== 'success') {
            throw new Error('Transaction was mined but failed.');
          }

          await loadTokenData(address);
          setTxStatus('success');
        } catch (e) {
          setTxStatus('error');
          setError(e instanceof Error ? e.message : 'Transaction failed.');
        }
      },
      [address, getWalletClient, isCorrectNetwork, loadTokenData, tokenDecimals],
  );

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const nextAddress = (accounts as Address[])?.[0] ?? null;
      setAddress(nextAddress);

      if (!nextAddress) {
        setTokenBalance(null);
        setFormattedBalance('—');
        setTxHash(null);
        setTxStatus('idle');
        return;
      }

      refreshWalletState(nextAddress).catch((e) => {
        setError(e instanceof Error ? e.message : 'Failed to refresh wallet state.');
      });
    };

    const handleChainChanged = (nextChainId: unknown) => {
      const parsed = parseChainId(nextChainId);
      setChainId(parsed);

      if (address) {
        refreshWalletState(address).catch((e) => {
          setError(e instanceof Error ? e.message : 'Failed to refresh after network change.');
        });
      }
    };

    window.ethereum.on?.('accountsChanged', handleAccountsChanged);
    window.ethereum.on?.('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [address, refreshWalletState]);

  return {
    address,
    chainId,
    chainName: CHAIN_NAME,
    contractAddress: CONTRACT_ADDRESS,
    tokenName,
    tokenSymbol,
    tokenDecimals,
    tokenBalance,
    formattedBalance,
    txStatus,
    txHash,
    error,
    isConnected,
    isCorrectNetwork,
    connect,
    disconnect,
    switchNetwork,
    transfer,
  };
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, cb: (args: unknown) => void) => void;
      removeListener?: (event: string, cb: (args: unknown) => void) => void;
    };
  }
}