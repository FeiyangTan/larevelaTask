import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { ErrorMessage } from '../components';

function truncateAddress(addr: string) {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function BlockchainDemo() {
  const { address, balance, txStatus, error, connect, disconnect, transfer, isConnected } = useWallet();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = () => {
    if (!toAddress || !amount) return;
    transfer(toAddress as `0x${string}`, BigInt(amount));
  };

  return (
    <div>
      <h1>Blockchain Demo</h1>
      <p>Connect a Web3 wallet (e.g. MetaMask). Set <code>VITE_CHAIN_ID</code> and <code>VITE_CONTRACT_ADDRESS</code> in .env.</p>

      {error && <ErrorMessage message={error} />}

      {!isConnected ? (
        <button type="button" onClick={connect}>
          Connect Wallet
        </button>
      ) : (
        <>
          <p>
            <strong>Address:</strong> {truncateAddress(address ?? '')}
            <button type="button" onClick={disconnect} style={{ marginLeft: '1rem' }}>
              Disconnect
            </button>
          </p>
          <p><strong>Contract balance (read):</strong> {balance != null ? balance.toString() : '—'}</p>

          <div style={{ marginTop: '1rem' }}>
            <input
              type="text"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="To address (0x…)"
              style={{ display: 'block', marginBottom: '0.5rem', padding: '0.5rem', width: '100%', maxWidth: '400px' }}
            />
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount (wei)"
              style={{ display: 'block', marginBottom: '0.5rem', padding: '0.5rem', width: '100%', maxWidth: '400px' }}
            />
            <button
              type="button"
              onClick={handleTransfer}
              disabled={txStatus === 'pending' || !toAddress || !amount}
            >
              {txStatus === 'pending' ? 'Pending…' : 'Transfer'}
            </button>
            {txStatus === 'success' && <span style={{ marginLeft: '0.5rem', color: 'green' }}>Success</span>}
            {txStatus === 'error' && <span style={{ marginLeft: '0.5rem', color: 'red' }}>Failed</span>}
          </div>
        </>
      )}
    </div>
  );
}
