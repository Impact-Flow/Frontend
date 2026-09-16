import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Sparkles, Github } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-navy-900 border-t border-navy-800/80 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-stellar-500 to-stellar-700 flex items-center justify-center shadow-glow-sm">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Impact<span className="text-stellar-400">Flow</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              &ldquo;Fund projects. Verify progress. Release funds transparently.&rdquo;
            </p>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Open-source decentralized public good funding on Stellar &amp; Soroban smart contracts. Escrows are programmatically unlocked as independent verifiers confirm deliverable progress.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-850 border border-navy-750 text-xs text-slate-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-stellar-400" />
                Powered by Stellar &amp; Soroban
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-850 border border-navy-750 text-xs text-slate-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Non-Custodial
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">
                  Explore Projects
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-white transition-colors">
                  Create Campaign
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link to="/verifier" className="hover:text-white transition-colors">
                  Verifier Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Open Source */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Open Source &amp; Docs
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/impactflow"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4 text-slate-400" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href="https://stellar.org/soroban"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Soroban Smart Contracts
                </a>
              </li>
              <li>
                <span className="text-xs text-slate-500">
                  Smart Contract: <code className="font-mono text-slate-400">v0.1.0 (Audited Core)</code>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} ImpactFlow. Open-source public goods under MIT License.</p>
          <p>Built with trustless milestone guarantees on Stellar.</p>
        </div>
      </div>
    </footer>
  );
};
