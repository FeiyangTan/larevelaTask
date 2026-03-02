/**
 * Blockchain config – set chain and contract in .env (VITE_CHAIN_ID, VITE_CONTRACT_ADDRESS).
 */

export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID ?? 1);
export const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS ?? '') as `0x${string}`;

export const SUPPORTED_CHAINS = [1, 11155111] as const; // 1 = mainnet, 11155111 = Sepolia
