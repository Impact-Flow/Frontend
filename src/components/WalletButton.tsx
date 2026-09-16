import React, { useState, useEffect, useRef } from "react";
import {
  connectWallet,
  disconnectWallet,
  subscribeWallet,
  ConnectedWallet,
} from "../services/stellar";
import { formatAddress } from "../lib/utils";
import { Wallet, LogOut, ChevronDown, CheckCircle2, Copy } from "lucide-react";

/**
 * WalletButton Component
 * 
 * NOTE: This component currently provides a realistic mock connection state.
 * Real Stellar wallet integration (e.g. Freighter, Albedo, Lobstr) will be
 * wired in here when connecting to the Soroban testnet/mainnet.
 */

interface WalletButtonProps {
  className?: string;
}

export const WalletButton: React.FC<WalletButtonProps> = ({ className = "" }) => {
  const [wallet, setWallet] = useState<ConnectedWallet>({
    address: null,
    isConnected: false,
    network: "Testnet",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeWallet(setWallet);
    return () => unsubscribe();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await connectWallet();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setIsDropdownOpen(false);
  };

  const handleCopy = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!wallet.isConnected) {
    return (
      <button
        onClick={handleConnect}
        disabled={isLoading}
        className={`relative inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-stellar-500 to-stellar-600 hover:from-stellar-600 hover:to-stellar-700 rounded-xl transition-all shadow-glow-sm hover:shadow-glow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-stellar-400/50 ${className}`}
        aria-label="Connect Stellar Wallet"
      >
        <Wallet className="w-4 h-4 text-stellar-100" />
        <span>{isLoading ? "Connecting..." : "Connect Wallet"}</span>
      </button>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-navy-800 hover:bg-navy-750 border border-navy-700 text-sm font-medium text-slate-200 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-stellar-500/30"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-mono text-xs">{formatAddress(wallet.address || "")}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-navy-850 border border-navy-700 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-navy-750">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Connected Account
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-stellar-500/10 text-stellar-300 border border-stellar-500/20 font-medium">
              {wallet.network}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-navy-900 border border-navy-800 mb-3">
            <div className="text-[11px] text-slate-500 font-mono break-all select-all leading-tight">
              {wallet.address}
            </div>
            <button
              onClick={handleCopy}
              className="mt-2 flex items-center gap-1.5 text-xs text-stellar-400 hover:text-stellar-300 font-medium transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Address copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy full address</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={handleDisconnect}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Disconnect</span>
          </button>
        </div>
      )}
    </div>
  );
};
