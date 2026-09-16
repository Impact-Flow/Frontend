import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Project, Milestone } from "../types";
import { getProjects, approveMilestone, rejectMilestone, releaseMilestone } from "../services/contract";
import { formatAmount, formatDate, formatAddress } from "../lib/utils";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  ArrowRight,
  Send,
  ExternalLink,
} from "lucide-react";

export const VerifierDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectModalItem, setRejectModalItem] = useState<{
    project: Project;
    milestone: Milestone;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    loadReviewQueue();
  }, []);

  const loadReviewQueue = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  // Collect all milestones awaiting review or approved awaiting release
  const reviewQueue = projects.flatMap((p) =>
    p.milestones
      .filter((m) => m.status === "Submitted" || m.status === "Approved")
      .map((m) => ({
        project: p,
        milestone: m,
      }))
  );

  const handleApprove = async (projectId: string, milestoneIndex: number) => {
    setIsProcessing(true);
    try {
      const res = await approveMilestone(projectId, milestoneIndex);
      setNotification({
        type: "success",
        message: res.message,
      });
      await loadReviewQueue();
      setTimeout(() => setNotification(null), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to approve milestone";
      setNotification({ type: "error", message: msg });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRelease = async (projectId: string, milestoneIndex: number) => {
    setIsProcessing(true);
    try {
      const res = await releaseMilestone(projectId, milestoneIndex);
      setNotification({
        type: "success",
        message: res.message,
      });
      await loadReviewQueue();
      setTimeout(() => setNotification(null), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to release milestone funds";
      setNotification({ type: "error", message: msg });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalItem || !rejectReason.trim()) return;

    setIsProcessing(true);
    try {
      const res = await rejectMilestone(
        rejectModalItem.project.id,
        rejectModalItem.milestone.index,
        rejectReason
      );
      setNotification({
        type: "success",
        message: res.message,
      });
      setRejectModalItem(null);
      setRejectReason("");
      await loadReviewQueue();
      setTimeout(() => setNotification(null), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reject milestone";
      setNotification({ type: "error", message: msg });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-10 lg:py-16 bg-navy-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stellar-500/10 border border-stellar-500/20 text-stellar-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Independent Audit Suite</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Milestone Reviews
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Verify submitted deliverables and authorize smart contract escrow releases on Stellar.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400 bg-navy-900 border border-navy-800 px-4 py-2 rounded-xl self-start sm:self-auto">
            Audit Queue: <span className="text-white font-bold">{reviewQueue.length} Pending</span>
          </div>
        </div>

        {/* Notifications */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-xs flex items-center justify-between animate-in fade-in duration-200 ${
              notification.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                : "bg-rose-500/10 border-rose-500/30 text-rose-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-white font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Reviews List */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-stellar-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400">Loading audit queue...</p>
          </div>
        ) : reviewQueue.length === 0 ? (
          <div className="text-center py-20 bg-navy-900 rounded-3xl border border-navy-800 p-8 max-w-lg mx-auto">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Queue is clear!</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              There are no milestones currently awaiting verification or funds release.
            </p>
            <Link
              to="/projects"
              className="text-xs text-stellar-400 hover:text-stellar-300 font-semibold inline-flex items-center gap-1"
            >
              <span>Explore active projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reviewQueue.map(({ project, milestone }) => {
              const allocatedAmount = (project.fundingGoal * milestone.percentage) / 100;

              return (
                <div
                  key={`${project.id}-${milestone.id}`}
                  className="p-6 rounded-3xl bg-navy-900 border border-navy-750 shadow-card space-y-5"
                >
                  {/* Top Bar: Project title, category & status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-navy-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-400 font-mono">
                          Project:
                        </span>
                        <Link
                          to={`/projects/${project.id}`}
                          className="font-bold text-white hover:text-stellar-300 text-base"
                        >
                          {project.title}
                        </Link>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-navy-800 text-slate-300 border border-navy-750">
                          {project.category}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        Creator: {formatAddress(project.creator, 6)} • Verifier: {formatAddress(project.verifier, 6)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                          milestone.status === "Submitted"
                            ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                            : "bg-sky-500/10 text-sky-300 border-sky-500/30"
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{milestone.status === "Submitted" ? "Submitted (Awaiting Audit)" : "Approved (Ready for Release)"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Milestone Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left: Milestone description */}
                    <div className="md:col-span-7 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-stellar-400 bg-navy-800 px-2.5 py-0.5 rounded border border-navy-750">
                          Milestone #{milestone.index}
                        </span>
                        <h4 className="text-base font-bold text-white">{milestone.title}</h4>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {milestone.description}
                      </p>

                      {/* Evidence Container */}
                      <div className="mt-3 p-4 rounded-2xl bg-navy-950 border border-navy-800 text-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-400 font-semibold">
                          <span className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-stellar-400" />
                            Submitted Evidence &amp; Deliverables:
                          </span>
                          {milestone.submittedDate && (
                            <span className="text-[11px] text-slate-500 font-normal">
                              Submitted {formatDate(milestone.submittedDate)}
                            </span>
                          )}
                        </div>

                        <p className="text-slate-200 leading-relaxed break-words font-mono text-[11px]">
                          {milestone.evidence || "No evidence text attached by creator."}
                        </p>

                        {milestone.evidenceUrl && (
                          <a
                            href={milestone.evidenceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-stellar-400 hover:text-stellar-300 font-medium text-xs pt-1"
                          >
                            <span>Inspect attached external artifact</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Right: Allocation & Action Buttons */}
                    <div className="md:col-span-5 flex flex-col justify-between p-4 rounded-2xl bg-navy-950 border border-navy-800 space-y-4">
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Funding Allocation:</span>
                          <span className="text-white font-bold font-mono">{milestone.percentage}%</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Tranche Payout:</span>
                          <span className="text-stellar-400 font-bold font-mono">
                            {formatAmount(allocatedAmount, project.fundingToken)}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Smart Contract:</span>
                          <span className="text-emerald-400 font-medium">Soroban Escrow</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-navy-850 space-y-2">
                        {milestone.status === "Submitted" ? (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => setRejectModalItem({ project, milestone })}
                              disabled={isProcessing}
                              className="px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>

                            <button
                              onClick={() => handleApprove(project.id, milestone.index)}
                              disabled={isProcessing}
                              className="px-3 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          </div>
                        ) : (
                          // Approved -> Ready to release
                          <button
                            onClick={() => handleRelease(project.id, milestone.index)}
                            disabled={isProcessing}
                            className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-stellar-500 to-stellar-600 hover:from-stellar-600 hover:to-stellar-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-glow-sm transition-all cursor-pointer"
                          >
                            <DollarSign className="w-4 h-4" />
                            <span>Authorize Funds Release to Creator</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reject Modal */}
        {rejectModalItem && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-navy-900 border border-navy-750 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-navy-800">
                <div className="flex items-center gap-2 text-rose-400">
                  <XCircle className="w-5 h-5" />
                  <h3 className="text-base font-bold text-white">Reject Deliverable</h3>
                </div>
                <button
                  onClick={() => setRejectModalItem(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Provide constructive audit feedback for Milestone #{rejectModalItem.milestone.index}.
                The creator will be prompted to resubmit corrected evidence.
              </p>

              <form onSubmit={handleConfirmReject} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                    Rejection Audit Reason <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Test coverage below 90%, missing electrical inspection certificate..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-750 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRejectModalItem(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-navy-800 border border-navy-750"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Confirm Rejection</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
