# Technical Test: API Integration & Blockchain

This repo contains the **task description** and a **React frontend** starter for the technical test.

## Contents

| Item | Description |
|------|-------------|
| [TASK.md](./TASK.md) | Full task: API integration (Swagger/Postman) + blockchain smart contract |
| **frontend/** | React + TypeScript app with API client and Web3 (viem) integration |
| **docs/** | Placeholder for Swagger/OpenAPI spec and notes (see [docs/SWAGGER.md](./docs/SWAGGER.md)) |

## Quick start

1. Read [TASK.md](./TASK.md).
2. Add your Swagger spec and/or Postman collection under `docs/` (or reference URLs in the task).
3. Run the frontend:

   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env (VITE_API_BASE_URL, VITE_CHAIN_ID, VITE_CONTRACT_ADDRESS)
   npm run dev
   ```

4. Implement API endpoints and contract calls per the task; use Postman to verify the API.
