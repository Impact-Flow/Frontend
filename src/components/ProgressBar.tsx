import React from "react";
import { cn } from "../lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
  barClassName?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = "md",
  showLabel = false,
  className,
  barClassName,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-3.5",
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5 font-medium">
          <span>Progress</span>
          <span className="text-white font-semibold">{percentage}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-navy-800 rounded-full overflow-hidden border border-navy-700/60 p-0.5",
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-stellar-500 to-stellar-400 transition-all duration-700 ease-out shadow-glow-sm",
            percentage >= 100 && "from-emerald-500 to-emerald-400 shadow-emerald-500/30",
            barClassName
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
