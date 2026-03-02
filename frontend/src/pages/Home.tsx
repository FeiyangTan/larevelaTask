import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div>
      <h1>Technical Test: API & Blockchain</h1>
      <p>This app demonstrates API integration and blockchain smart contract usage.</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '0.5rem' }}>
          <Link to="/api-demo">API Demo</Link> – List, create, update, delete (align with Swagger/Postman).
        </li>
        <li>
          <Link to="/blockchain-demo">Blockchain Demo</Link> – Connect wallet, read balance, send transaction.
        </li>
      </ul>
    </div>
  );
}
