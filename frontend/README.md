# Frontend – API & Blockchain Technical Test

React + TypeScript frontend with API integration and blockchain (Web3) support.

## Structure

```
src/
  api/           # API client (replace with OpenAPI-generated client when spec is ready)
  blockchain/    # Contract config, read/write helpers (viem)
  components/    # Layout, ErrorMessage, Loading
  hooks/         # useApi (React Query), useWallet (connect, read, write)
  pages/         # Home, ApiDemo, BlockchainDemo
  types/         # Shared API types
```

## Setup

```bash
npm install
cp .env.example .env
# Edit .env: VITE_API_BASE_URL, VITE_CHAIN_ID, VITE_CONTRACT_ADDRESS
npm run dev
```

## API

- **Base URL**: Set `VITE_API_BASE_URL` in `.env` (e.g. `http://localhost:3000/api`). Must match your Swagger/Postman base URL.
- **Auth**: If the API uses Bearer tokens, set `VITE_API_TOKEN`.
- **Swagger**: Put your OpenAPI spec in `docs/` or use its URL; see `docs/SWAGGER.md` for codegen (e.g. openapi-typescript-codegen, orval).
- **Postman**: Use the provided collection to test endpoints; keep request/response shape aligned with the app.

## Blockchain

- **Wallet**: Connect via MetaMask (or other injected provider). Chain and contract are read from env.
- **Config**: `VITE_CHAIN_ID` (e.g. `1` for mainnet, `11155111` for Sepolia), `VITE_CONTRACT_ADDRESS` (your contract).
- **Read**: Example `balanceOf` in `blockchain/contract.ts` – replace ABI with your contract.
- **Write**: Example `transfer` – same; show tx status in UI (pending/success/error).

## Scripts

- `npm run dev` – development server
- `npm run build` – production build
- `npm run preview` – preview production build
