import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Project, Milestone } from "../types";
import { getProjects, submitMilestone, requestRefund } from "../services/contract";
import { getConnectedWallet, subscribeWallet, ConnectedWallet } from "../services/stellar";
import { ProjectStatus } from "../components/ProjectStatus";
import { ProgressBar } from "../components/ProgressBar";
import { formatAmount, formatAddress, formatDate } from "../lib/utils";
import {
  Layers,
  Coins,
  CheckCircle2,
  Clock,
  Send,
  ExternalLink,
  TrendingUp,
  RotateCcw,
  Activity as ActivityIcon,
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "contributions" | "projects" | "activity">("overview");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<ConnectedWallet>(getConnectedWallet());

  // Evidence submission state for My Projects tab
  const [selectedMilestone, setSelectedMilestone] = useState<{
    project: Project;
    milestone: Milestone;
  } | null>(null);
  const [evidenceText, setEvidenceText] = useState("");
  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeWallet(setWallet);
    return () => unsub();
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const allProjects = await getProjects();
      setProjects(allProjects);
    } finally {
      setLoading(false);
    }
  };

  // Mock filtering: user contributions vs user creator projects
  // User's contributed projects: any project with activities matching the user address or sample set
  const currentAddress = wallet.address || "GCIK7VHYPX7OAW627YI26R6T5N6F62F3PAB2436AZEI7KLPX42RUMOCK";
  
  const myContributedProjects = projects.filter(
    (p) =>
      p.activities?.some((a) => a.contributorAddress === currentAddress) ||
      p.id === "proj-solar-hub" ||
      p.id === "proj-open-health"
  );

  // User's creator projects
  const myCreatedProjects = projects.filter(
    (p) =>
      p.creator === currentAddress ||
      p.id === "proj-clean-water" ||
      p.id === "proj-solar-hub"
  );

  // Calculate overview metrics
  const totalContributed = myContributedProjects.reduce((sum, p) => {
    const userActs = p.activities?.filter((a) => a.contributorAddress === currentAddress) || [];
    const subtotal = userActs.reduce((s, a) => s + a.amount, 0);
    return sum + (subtotal > 0 ? subtotal : 2500); // fallback sample amount
  }, 0);

  const activeCount = projects.filter((p) => p.status === "Funding" || p.status === "In Progress").length;
  const completedCount = projects.filter((p) => p.status === "Completed").length;
  const pendingMilestonesCount = projects.reduce(
    (count, p) => count + p.milestones.filter((m) => m.status === "Pending" || m.status === "Submitted").length,
    0
  );

  const handleSubmitEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestone || !evidenceText.trim()) return;

    setIsSubmittingEvidence(true);
    try {
      await submitMilestone(selectedMilestone.project.id, selectedMilestone.milestone.index, evidenceText);
      setActionNotice(`Evidence successfully submitted for Milestone #${selectedMilestone.milestone.index}!`);
      setSelectedMilestone(null);
      setEvidenceText("");
      await loadData();
      setTimeout(() => setActionNotice(null), 5000);
    } finally {
      setIsSubmittingEvidence(false);
    }
  };

  const handleClaimRefund = async (projectId: string) => {
    try {
      const res = await requestRefund(projectId, currentAddress);
      setActionNotice(res.message);
      await loadData();
      setTimeout(() => setActionNotice(null), 6000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to claim refund";
      setActionNotice(message);
    }
  };

  return (
    <div className="min-h-screen py-10 lg:py-16 bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-stellar-400 uppercase tracking-wider">
              Management Portal
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
              Contributor &amp; Creator Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Wallet: {formatAddress(currentAddress, 8)}
            </p>
          </div>

          <Link
            to="/create"
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-stellar-500 hover:bg-stellar-600 shadow-glow-sm transition-colors cursor-pointer"
          >
            Create New Campaign
          </Link>
        </div>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-stellar-500/10 border border-stellar-500/30 text-stellar-200 text-xs flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-stellar-400 shrink-0" />
              <span>{actionNotice}</span>
            </div>
            <button
              onClick={() => setActionNotice(null)}
              className="text-slate-400 hover:text-white font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-navy-800 mb-8 overflow-x-auto scrollbar-none">
          {[
            { id: "overview", label: "Overview", icon: <Layers className="w-4 h-4" /> },
            { id: "contributions", label: "My Contributions", icon: <Coins className="w-4 h-4" /> },
            { id: "projects", label: "My Projects", icon: <TrendingUp className="w-4 h-4" /> },
            { id: "activity", label: "Activity Log", icon: <ActivityIcon className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 py-3.5 px-5 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-stellar-400 text-white bg-navy-900/50"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:border-navy-700"
              }`}
            >
              <span className={activeTab === tab.id ? "text-stellar-400" : "text-slate-500"}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-stellar-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400">Loading dashboard records...</p>
          </div>
        ) : (
          <div>
            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-card">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Total Contributed
                      </span>
                      <Coins className="w-5 h-5 text-stellar-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">
                      {formatAmount(totalContributed, "XLM")}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Across {myContributedProjects.length} campaigns backed
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-card">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Active Campaigns
                      </span>
                      <TrendingUp className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">
                      {activeCount}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Funding or under execution
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-card">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Completed Projects
                      </span>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">
                      {completedCount}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      100% milestone delivery achieved
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-card">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Pending Milestones
                      </span>
                      <Clock className="w-5 h-5 text-sky-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white">
                      {pendingMilestonesCount}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Awaiting submission or review
                    </div>
                  </div>
                </div>

                {/* Quick Action & Recents Split */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Backed Projects */}
                  <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-white">My Backed Projects</h3>
                      <button
                        onClick={() => setActiveTab("contributions")}
                        className="text-xs text-stellar-400 hover:text-stellar-300 font-medium"
                      >
                        View all
                      </button>
                    </div>
                    <div className="space-y-3">
                      {myContributedProjects.slice(0, 3).map((p) => (
                        <div
                          key={p.id}
                          className="p-4 rounded-2xl bg-navy-950 border border-navy-800 flex items-center justify-between gap-3"
                        >
                          <div>
                            <Link
                              to={`/projects/${p.id}`}
                              className="font-bold text-white text-sm hover:text-stellar-300"
                            >
                              {p.title}
                            </Link>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {p.category} • {formatAmount(p.raisedAmount, p.fundingToken)} raised
                            </div>
                          </div>
                          <ProjectStatus status={p.status} size="sm" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Creator Projects Overview */}
                  <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-white">My Created Projects</h3>
                      <button
                        onClick={() => setActiveTab("projects")}
                        className="text-xs text-stellar-400 hover:text-stellar-300 font-medium"
                      >
                        Manage
                      </button>
                    </div>
                    <div className="space-y-3">
                      {myCreatedProjects.slice(0, 3).map((p) => (
                        <div
                          key={p.id}
                          className="p-4 rounded-2xl bg-navy-950 border border-navy-800 flex items-center justify-between gap-3"
                        >
                          <div>
                            <Link
                              to={`/projects/${p.id}`}
                              className="font-bold text-white text-sm hover:text-stellar-300"
                            >
                              {p.title}
                            </Link>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {p.milestones.length} Milestones • Goal {formatAmount(p.fundingGoal, p.fundingToken)}
                            </div>
                          </div>
                          <ProjectStatus status={p.status} size="sm" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MY CONTRIBUTIONS */}
            {activeTab === "contributions" && (
              <div className="space-y-6">
                <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-card">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white">Projects You Funded</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Track the delivery status of initiatives you contributed to and inspect milestone progress.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {myContributedProjects.map((p) => {
                      const percentage = Math.min(100, Math.round((p.raisedAmount / p.fundingGoal) * 100));
                      const userActs = p.activities?.filter((a) => a.contributorAddress === currentAddress) || [];
                      const userContrib = userActs.reduce((s, a) => s + a.amount, 0) || 2500;

                      return (
                        <div
                          key={p.id}
                          className="p-5 rounded-2xl bg-navy-950 border border-navy-800 hover:border-navy-700 transition-colors space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 text-[11px] rounded bg-navy-800 text-slate-300 border border-navy-750">
                                  {p.category}
                                </span>
                                <ProjectStatus status={p.status} size="sm" />
                              </div>
                              <h3 className="text-lg font-bold text-white">
                                <Link to={`/projects/${p.id}`} className="hover:text-stellar-300">
                                  {p.title}
                                </Link>
                              </h3>
                            </div>

                            <div className="text-left sm:text-right">
                              <div className="text-xs text-slate-400">Your Contribution</div>
                              <div className="text-base font-bold text-white font-mono">
                                {formatAmount(userContrib, p.fundingToken)}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div>
                              <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>Project Progress</span>
                                <span className="font-semibold text-white">{percentage}%</span>
                              </div>
                              <ProgressBar value={p.raisedAmount} max={p.fundingGoal} size="sm" />
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                              <Link
                                to={`/projects/${p.id}`}
                                className="px-3.5 py-1.5 rounded-xl bg-navy-850 hover:bg-navy-800 border border-navy-750 text-slate-200 font-medium flex items-center gap-1"
                              >
                                <span>Inspect Details</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>

                              {/* Refund simulator */}
                              <button
                                onClick={() => handleClaimRefund(p.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-navy-800 hover:bg-navy-750 border border-navy-700 text-stellar-300 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
                                title="Request refund if project conditions allow"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Claim Refund</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MY PROJECTS */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">Created Campaigns</h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Submit verification deliverables for your milestones to unlock escrow payouts.
                      </p>
                    </div>

                    <Link
                      to="/create"
                      className="px-4 py-2 rounded-xl bg-stellar-500 hover:bg-stellar-600 text-white text-xs font-semibold self-start sm:self-auto"
                    >
                      + New Project
                    </Link>
                  </div>

                  <div className="space-y-6">
                    {myCreatedProjects.map((p) => (
                      <div
                        key={p.id}
                        className="p-6 rounded-2xl bg-navy-950 border border-navy-800 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-navy-850">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-slate-400">{p.category}</span>
                              <ProjectStatus status={p.status} size="sm" />
                            </div>
                            <h3 className="text-lg font-bold text-white">
                              <Link to={`/projects/${p.id}`} className="hover:text-stellar-300">
                                {p.title}
                              </Link>
                            </h3>
                          </div>

                          <div className="text-xs text-slate-400">
                            Escrow: <span className="font-bold text-white font-mono">{formatAmount(p.raisedAmount, p.fundingToken)}</span> / {formatAmount(p.fundingGoal, p.fundingToken)}
                          </div>
                        </div>

                        {/* Milestones inside this project */}
                        <div>
                          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            Milestone Status &amp; Deliverables
                          </h4>
                          <div className="space-y-3">
                            {p.milestones.map((m) => (
                              <div
                                key={m.id}
                                className="p-4 rounded-xl bg-navy-900 border border-navy-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                              >
                                <div>
                                  <div className="font-bold text-white text-sm">
                                    #{m.index} — {m.title} ({m.percentage}%)
                                  </div>
                                  <p className="text-slate-400 mt-1 text-xs max-w-xl">
                                    {m.description}
                                  </p>
                                  {m.evidence && (
                                    <div className="mt-2 text-slate-400 text-[11px] bg-navy-950 p-2 rounded border border-navy-800">
                                      <span className="text-slate-500 font-semibold">Submitted:</span> {m.evidence}
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                  <span className="font-semibold text-stellar-300 bg-navy-800 px-2.5 py-1 rounded-full border border-navy-750">
                                    {m.status}
                                  </span>

                                  {/* Submit evidence button if Pending or Rejected */}
                                  {(m.status === "Pending" || m.status === "Rejected") && (
                                    <button
                                      onClick={() => setSelectedMilestone({ project: p, milestone: m })}
                                      className="px-3 py-1.5 rounded-xl bg-stellar-500 hover:bg-stellar-600 text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                      <Send className="w-3 h-3" />
                                      <span>Submit Evidence</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence Submission Dialog Modal */}
                {selectedMilestone && (
                  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-navy-900 border border-navy-750 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95">
                      <div className="flex items-center justify-between pb-3 border-b border-navy-800">
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            Submit Milestone Evidence
                          </h3>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {selectedMilestone.project.title} • Milestone #{selectedMilestone.milestone.index}
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedMilestone(null)}
                          className="p-1 rounded-lg text-slate-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>

                      <form onSubmit={handleSubmitEvidence} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            Deliverable Summary &amp; Verification Evidence
                          </label>
                          <textarea
                            rows={4}
                            required
                            value={evidenceText}
                            onChange={(e) => setEvidenceText(e.target.value)}
                            placeholder="Detail completed tasks, provide GitHub release links, testing reports, or documentation URL for verifier review..."
                            className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-navy-750 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-stellar-500"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setSelectedMilestone(null)}
                            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-navy-800 border border-navy-750"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmittingEvidence}
                            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-stellar-500 hover:bg-stellar-600 disabled:opacity-50 flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isSubmittingEvidence ? "Submitting..." : "Submit to Verifier"}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: ACTIVITY LOG */}
            {activeTab === "activity" && (
              <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white">Chronological Activity</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    All funding deposits and milestone transitions linked to your account.
                  </p>
                </div>

                <div className="divide-y divide-navy-800/80">
                  {projects.flatMap((p) => p.activities || []).map((act) => (
                    <div
                      key={act.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-stellar-500/10 border border-stellar-500/20 text-stellar-400 flex items-center justify-center font-mono shrink-0">
                          TX
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            Contribution of {formatAmount(act.amount, act.token || "XLM")}
                          </div>
                          <div className="text-slate-400 text-[11px] mt-0.5">
                            From {formatAddress(act.contributorAddress, 6)} • Hash: <span className="font-mono text-stellar-400">{act.txHash.slice(0, 14)}...</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-slate-500 text-[11px] font-mono">
                        {formatDate(act.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
