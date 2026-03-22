# NOTES

## Design Decisions

- Used **React Query** for API state management (caching, loading, error handling)
- Used **Orval** for type-safe API client generation
- Used **viem** for blockchain interaction
- Used **ERC-20 ABI** to keep contract simple to test
- Env-based config for flexibility

---

## Improvements

- Improve error handling (better UI feedback)
- Add Etherscan links for transactions
- Support multi-chain
