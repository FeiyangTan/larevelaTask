import { useState } from 'react';
import { ErrorMessage } from '../components';
import { CHAIN_ID } from '../blockchain';
import { useWallet } from '../hooks/useWallet';

function truncateAddress(addr: string) {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function BlockchainDemo() {
  const {
    address,
    chainId,
    chainName,
    contractAddress,
    tokenName,
    tokenSymbol,
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
  } = useWallet();

  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = async () => {
    await transfer(toAddress, amount);
  };

  return (
      <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'left' }}>
        <h1>Blockchain Demo</h1>
        <p>
          This page connects to a Sepolia ERC-20 token contract. It shows one read operation
          (<code>name</code>, <code>symbol</code>, <code>balanceOf</code>) and one write operation
          (<code>transfer</code>).
        </p>

        <div
            style={{
              border: '1px solid #ddd',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1rem',
            }}
        >
          <p>
            <strong>Required network:</strong> {chainName} (chainId {CHAIN_ID})
          </p>
          <p>
            <strong>Current wallet network:</strong> {chainId ?? 'Not connected'}
          </p>
          <p>
            <strong>Contract address:</strong>{' '}
            {contractAddress ? contractAddress : 'Set VITE_CONTRACT_ADDRESS in .env'}
          </p>

          {!isConnected ? (
              <button type="button" onClick={connect}>
                Connect Wallet
              </button>
          ) : (
              <div>
                <p>
                  <strong>Wallet:</strong> {truncateAddress(address ?? '')}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button type="button" onClick={disconnect}>
                    Disconnect
                  </button>
                  {!isCorrectNetwork && (
                      <button type="button" onClick={switchNetwork}>
                        Switch to {chainName}
                      </button>
                  )}
                </div>
              </div>
          )}
        </div>

        {error && <ErrorMessage message={error} />}

        <div
            style={{
              border: '1px solid #ddd',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1rem',
            }}
        >
          <h2 style={{ marginTop: 0 }}>Read from contract</h2>
          <p>
            <strong>Token name:</strong> {tokenName || '—'}
          </p>
          <p>
            <strong>Token symbol:</strong> {tokenSymbol || '—'}
          </p>
          <p>
            <strong>Your token balance:</strong>{' '}
            {isConnected && isCorrectNetwork ? `${formattedBalance} ${tokenSymbol}` : '—'}
          </p>
        </div>

        <div
            style={{
              border: '1px solid #ddd',
              borderRadius: '12px',
              padding: '1rem',
            }}
        >
          <h2 style={{ marginTop: 0 }}>Write to contract</h2>
          <p>Transfer some of your Sepolia test tokens to another address.</p>

          <label style={{ display: 'block', marginBottom: '0.75rem' }}>
            Recipient address
            <input
                type="text"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                placeholder="0x..."
                style={{
                  display: 'block',
                  marginTop: '0.25rem',
                  padding: '0.75rem',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '0.75rem' }}>
            Amount ({tokenSymbol || 'token'})
            <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1.5"
                style={{
                  display: 'block',
                  marginTop: '0.25rem',
                  padding: '0.75rem',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
            />
          </label>

          <button
              type="button"
              onClick={handleTransfer}
              disabled={!isConnected || !isCorrectNetwork || txStatus === 'pending'}
          >
            {txStatus === 'pending' ? 'Transaction pending...' : 'Transfer'}
          </button>

          <div style={{ marginTop: '1rem' }}>
            <p>
              <strong>Status:</strong>{' '}
              {txStatus === 'idle' && 'Ready'}
              {txStatus === 'pending' && 'Transaction pending'}
              {txStatus === 'success' && 'Success'}
              {txStatus === 'error' && 'Failed'}
            </p>
            {txHash && (
                <p>
                  <strong>Transaction hash:</strong> {txHash}
                </p>
            )}
          </div>
        </div>
      </div>
  );
}