import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { WalletButton } from "./WalletButton";
import { PlusCircle, Menu, X, Shield, Activity, Compass, Layers } from "lucide-react";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Explore", path: "/projects", icon: <Compass className="w-4 h-4" /> },
    { name: "How It Works", path: "/#how-it-works", icon: <Layers className="w-4 h-4" /> },
    { name: "Dashboard", path: "/dashboard", icon: <Activity className="w-4 h-4" /> },
    { name: "Verifier", path: "/verifier", icon: <Shield className="w-4 h-4" /> },
  ];

  const isActive = (path: string) => {
    if (path.startsWith("/#")) return false;
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-navy-950/80 border-b border-navy-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-stellar-500 to-stellar-700 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-all">
              {/* Custom SVG logo: Stylized flowing impact nodes */}
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Impact<span className="text-stellar-400">Flow</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Stellar Milestones
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? "text-white bg-navy-800 border border-navy-700 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-navy-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white bg-navy-850 hover:bg-navy-800 border border-navy-700 hover:border-slate-600 rounded-xl transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-stellar-400" />
              <span>Create Project</span>
            </Link>

            <WalletButton />
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <WalletButton />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-navy-850 border border-navy-700 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-navy-800 bg-navy-900 px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? "bg-navy-800 text-white font-semibold"
                  : "text-slate-300 hover:bg-navy-850 hover:text-white"
              }`}
            >
              <span className="text-stellar-400">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          ))}

          <div className="pt-3 border-t border-navy-800">
            <Link
              to="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-navy-800 border border-navy-700 text-sm font-medium text-white hover:bg-navy-750"
            >
              <PlusCircle className="w-4 h-4 text-stellar-400" />
              <span>Create Project</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
