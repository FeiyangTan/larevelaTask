import { sepolia, mainnet, type Chain } from 'viem/chains';

/**
 * Blockchain config.
 *
 * For this task, Sepolia is the recommended network:
 * - Chain ID: 11155111
 * - Contract address: your deployed ERC-20 token address
 * - RPC URL: any Sepolia RPC endpoint (Infura, Alchemy, Ankr, etc.)
 */

export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID ?? 11155111);
export const RPC_URL = import.meta.env.VITE_RPC_URL ?? '';
export const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS ?? '') as `0x${string}`;

export const SUPPORTED_CHAIN_IDS = [11155111, 1] as const;

export const CHAIN: Chain =
    CHAIN_ID === sepolia.id ? sepolia : CHAIN_ID === mainnet.id ? mainnet : sepolia;

export const CHAIN_NAME = CHAIN.name;