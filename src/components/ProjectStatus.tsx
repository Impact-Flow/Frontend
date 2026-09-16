import React from "react";
import { ProjectStatus as ProjectStatusType } from "../types";
import { cn } from "../lib/utils";
import { CheckCircle2, Clock, Sparkles, TrendingUp } from "lucide-react";

interface ProjectStatusProps {
  status: ProjectStatusType;
  className?: string;
  size?: "sm" | "md";
}

export const ProjectStatus: React.FC<ProjectStatusProps> = ({
  status,
  className,
  size = "md",
}) => {
  const config: Record<
    ProjectStatusType,
    {
      bg: string;
      text: string;
      border: string;
      dot: string;
      icon: React.ReactNode;
      label: string;
    }
  > = {
    Funding: {
      bg: "bg-stellar-500/10",
      text: "text-stellar-300",
      border: "border-stellar-500/30",
      dot: "bg-stellar-400 animate-pulse",
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      label: "Funding",
    },
    Funded: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-300",
      border: "border-emerald-500/30",
      dot: "bg-emerald-400",
      icon: <Sparkles className="w-3.5 h-3.5" />,
      label: "Funded",
    },
    "In Progress": {
      bg: "bg-amber-500/10",
      text: "text-amber-300",
      border: "border-amber-500/30",
      dot: "bg-amber-400 animate-pulse",
      icon: <Clock className="w-3.5 h-3.5" />,
      label: "In Progress",
    },
    Completed: {
      bg: "bg-teal-500/10",
      text: "text-teal-300",
      border: "border-teal-500/30",
      dot: "bg-teal-400",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      label: "Completed",
    },
  };

  const style = config[status] || config.Funding;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border tracking-wide select-none",
        style.bg,
        style.text,
        style.border,
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-xs",
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
      <span>{style.label}</span>
    </span>
  );
};
