import React from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 bg-navy-950">
      <div className="max-w-md w-full text-center p-8 sm:p-10 rounded-3xl bg-navy-900 border border-navy-800 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-stellar-500/10 border border-stellar-500/20 text-stellar-400 flex items-center justify-center mx-auto mb-6">
          <Compass className="w-8 h-8" />
        </div>

        <div className="text-xs font-mono font-bold text-stellar-400 tracking-wider uppercase mb-2">
          Error 404
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed mb-8">
          The requested route does not exist on ImpactFlow or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-stellar-500 hover:bg-stellar-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/projects"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-navy-850 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-750 text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Browse Projects</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
