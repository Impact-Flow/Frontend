import React from "react";
import { Milestone, MilestoneStatus } from "../types";
import { formatAmount } from "../lib/utils";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Send,
  ExternalLink,
  DollarSign,
} from "lucide-react";

interface MilestoneCardProps {
  milestone: Milestone;
  fundingGoal?: number;
  fundingToken?: string;
  onAction?: (milestone: Milestone) => void;
  actionLabel?: string;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  fundingGoal,
  fundingToken = "XLM",
  onAction,
  actionLabel,
}) => {
  const allocatedAmount = fundingGoal ? (fundingGoal * milestone.percentage) / 100 : null;

  const statusConfig: Record<
    MilestoneStatus,
    {
      badgeBg: string;
      badgeText: string;
      badgeBorder: string;
      icon: React.ReactNode;
      label: string;
      borderAccent: string;
    }
  > = {
    Pending: {
      badgeBg: "bg-slate-500/10",
      badgeText: "text-slate-400",
      badgeBorder: "border-slate-500/20",
      icon: <Clock className="w-3.5 h-3.5 text-slate-400" />,
      label: "Pending",
      borderAccent: "border-navy-700/60",
    },
    Submitted: {
      badgeBg: "bg-amber-500/10",
      badgeText: "text-amber-300",
      badgeBorder: "border-amber-500/30",
      icon: <Send className="w-3.5 h-3.5 text-amber-400 animate-pulse" />,
      label: "Submitted (In Review)",
      borderAccent: "border-amber-500/30",
    },
    Approved: {
      badgeBg: "bg-sky-500/10",
      badgeText: "text-sky-300",
      badgeBorder: "border-sky-500/30",
      icon: <FileCheck className="w-3.5 h-3.5 text-sky-400" />,
      label: "Approved",
      borderAccent: "border-sky-500/40",
    },
    Rejected: {
      badgeBg: "bg-rose-500/10",
      badgeText: "text-rose-300",
      badgeBorder: "border-rose-500/30",
      icon: <AlertCircle className="w-3.5 h-3.5 text-rose-400" />,
      label: "Rejected",
      borderAccent: "border-rose-500/30",
    },
    "Funds Released": {
      badgeBg: "bg-emerald-500/10",
      badgeText: "text-emerald-300",
      badgeBorder: "border-emerald-500/30",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
      label: "Funds Released",
      borderAccent: "border-emerald-500/40",
    },
  };

  const currentStatus = statusConfig[milestone.status] || statusConfig.Pending;

  return (
    <div
      className={`relative bg-navy-850 border ${currentStatus.borderAccent} rounded-2xl p-5 sm:p-6 transition-all shadow-card`}
    >
      {/* Header with index, title and status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-navy-750">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-navy-800 border border-navy-700 font-mono text-sm font-bold text-stellar-400 shrink-0">
            #{milestone.index}
          </span>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white leading-tight">
              {milestone.title}
            </h4>
            <div className="text-xs text-slate-400 mt-0.5">
              Allocation: <span className="text-white font-semibold">{milestone.percentage}%</span>
              {allocatedAmount !== null && (
                <span className="ml-1.5 text-stellar-400 font-mono">
                  ({formatAmount(allocatedAmount, fundingToken)})
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${currentStatus.badgeBg} ${currentStatus.badgeText} ${currentStatus.badgeBorder}`}
          >
            {currentStatus.icon}
            <span>{currentStatus.label}</span>
          </span>
        </div>
      </div>

      {/* Milestone description */}
      <p className="mt-3.5 text-sm text-slate-300 leading-relaxed font-normal">
        {milestone.description}
      </p>

      {/* Funds released indicator */}
      {milestone.fundsReleased !== undefined && milestone.fundsReleased > 0 && (
        <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            Released: {formatAmount(milestone.fundsReleased, fundingToken)} transferred to creator
          </span>
        </div>
      )}

      {/* Evidence and verification details if present */}
      {milestone.evidence && (
        <div className="mt-4 p-3.5 rounded-xl bg-navy-900 border border-navy-800 text-xs">
          <div className="text-slate-400 font-semibold mb-1 flex items-center justify-between">
            <span>Submitted Evidence / Deliverables:</span>
            {milestone.submittedDate && (
              <span className="text-slate-500 font-normal">
                {new Date(milestone.submittedDate).toLocaleDateString()}
              </span>
            )}
          </div>
          <p className="text-slate-300 leading-relaxed break-words">{milestone.evidence}</p>

          {milestone.evidenceUrl && (
            <a
              href={milestone.evidenceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-stellar-400 hover:text-stellar-300 font-medium transition-colors"
            >
              <span>View external verification proof</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Rejection note if rejected */}
      {milestone.status === "Rejected" && milestone.reviewNotes && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/30 text-xs text-rose-300">
          <div className="font-semibold mb-1">Verifier Review Feedback:</div>
          <p>{milestone.reviewNotes}</p>
        </div>
      )}

      {/* Optional action button for creator or verifier */}
      {onAction && actionLabel && (
        <div className="mt-4 pt-3 border-t border-navy-750 flex justify-end">
          <button
            onClick={() => onAction(milestone)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-stellar-500 hover:bg-stellar-600 transition-colors cursor-pointer"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
};
