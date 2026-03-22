import {
  createPublicClient,
  createWalletClient,
  erc20Abi,
  http,
  type Address,
  type Hash,
} from 'viem';
import { CHAIN, CONTRACT_ADDRESS, RPC_URL } from './config';

export const publicClient = createPublicClient({
  chain: CHAIN,
  transport: http(RPC_URL || undefined),
});

export const TOKEN_ABI = erc20Abi;

function assertContractAddress() {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
    throw new Error('Contract address is not configured. Set VITE_CONTRACT_ADDRESS in .env.');
  }
}

export async function readTokenName() {
  assertContractAddress();
  return publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'name',
  });
}

export async function readTokenSymbol() {
  assertContractAddress();
  return publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'symbol',
  });
}

export async function readTokenDecimals() {
  assertContractAddress();
  return publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'decimals',
  });
}

export async function readTokenBalance(account: Address) {
  assertContractAddress();
  return publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: [account],
  });
}

export async function writeTransfer(
    walletClient: ReturnType<typeof createWalletClient>,
    account: Address,
    to: Address,
    amount: bigint,
) {
  assertContractAddress();
  return walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'transfer',
    args: [to, amount],
    account,
    chain: CHAIN,
  });
}

export async function waitForTx(hash: Hash) {
  return publicClient.waitForTransactionReceipt({ hash });
}