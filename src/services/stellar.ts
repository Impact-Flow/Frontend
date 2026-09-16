/**
 * Stellar Wallet Service (Mock / Service Layer)
 * 
 * NOTE: This is currently a mock service layer for wallet operations.
 * Real Stellar wallet integration (e.g. Freighter, Albedo, Hana, xBull)
 * will be implemented in a subsequent phase connecting to the Soroban testnet/mainnet.
 */

export interface ConnectedWallet {
  address: string | null;
  isConnected: boolean;
  network: string;
}

// In-memory simulated wallet state
const MOCK_STORAGE_KEY = "impactflow_mock_wallet_address";
const DEFAULT_MOCK_ADDRESS = "GCIK7VHYPX7OAW627YI26R6T5N6F62F3PAB2436AZEI7KLPX42RUMOCK";

type WalletListener = (wallet: ConnectedWallet) => void;
const listeners: Set<WalletListener> = new Set();

function notifyListeners() {
  const current = getConnectedWallet();
  listeners.forEach((listener) => listener(current));
}

export function subscribeWallet(listener: WalletListener): () => void {
  listeners.add(listener);
  listener(getConnectedWallet());
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Connects to the user's Stellar wallet.
 * Placeholder implementation: generates/stores a mock Stellar address in session.
 */
export async function connectWallet(): Promise<{ address: string }> {
  // Simulate asynchronous wallet handshake
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  const address = localStorage.getItem(MOCK_STORAGE_KEY) || DEFAULT_MOCK_ADDRESS;
  localStorage.setItem(MOCK_STORAGE_KEY, address);
  
  notifyListeners();
  return { address };
}

/**
 * Disconnects the active wallet.
 */
export async function disconnectWallet(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  localStorage.removeItem(MOCK_STORAGE_KEY);
  notifyListeners();
}

/**
 * Synchronously retrieves current wallet connection status.
 */
export function getConnectedWallet(): ConnectedWallet {
  if (typeof window === "undefined") {
    return { address: null, isConnected: false, network: "Testnet" };
  }
  const address = localStorage.getItem(MOCK_STORAGE_KEY);
  return {
    address: address || null,
    isConnected: Boolean(address),
    network: "Testnet",
  };
}
