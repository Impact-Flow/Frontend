import React from "react";
import { cn } from "../lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  align = "center",
  className,
}) => {
  return (
    <div
      className={cn(
        "mb-12",
        align === "center" ? "text-center max-w-3xl mx-auto" : "text-left max-w-2xl",
        className
      )}
    >
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stellar-500/10 border border-stellar-500/20 text-stellar-300 text-xs font-semibold uppercase tracking-wider mb-4">
          {badge}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3.5 text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
};
