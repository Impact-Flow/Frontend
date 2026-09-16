import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Project } from "../types";
import { getProject, fundProject } from "../services/contract";
import { getConnectedWallet, connectWallet, subscribeWallet, ConnectedWallet } from "../services/stellar";
import { ProjectStatus } from "../components/ProjectStatus";
import { ProgressBar } from "../components/ProgressBar";
import { MilestoneCard } from "../components/MilestoneCard";
import { formatAmount, formatAddress, formatDate, calculateDaysRemaining } from "../lib/utils";
import {
  ChevronRight,
  User,
  ShieldCheck,
  Calendar,
  Wallet,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Activity,
} from "lucide-react";

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [fundAmount, setFundAmount] = useState<string>("250");
  const [isFunding, setIsFunding] = useState(false);
  const [fundSuccess, setFundSuccess] = useState<string | null>(null);
  const [fundError, setFundError] = useState<string | null>(null);
  const [wallet, setWallet] = useState<ConnectedWallet>(getConnectedWallet());

  useEffect(() => {
    const unsub = subscribeWallet(setWallet);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  const loadProject = async (projectId: string) => {
    setLoading(true);
    try {
      const data = await getProject(projectId);
      setProject(data);
    } finally {
      setLoading(false);
    }
  };

  const handleFund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    const amountNum = parseFloat(fundAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setFundError("Please enter a valid amount greater than 0");
      return;
    }

    setFundError(null);
    setFundSuccess(null);
    setIsFunding(true);

    try {
      const res = await fundProject(project.id, amountNum, wallet.address || undefined);
      setFundSuccess(res.message);
      // Refresh project state
      await loadProject(project.id);
      setTimeout(() => setFundSuccess(null), 5000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to contribute to project";
      setFundError(message);
    } finally {
      setIsFunding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 bg-navy-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-stellar-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen py-20 bg-navy-950 text-center px-4">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-navy-900 border border-navy-800">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-sm text-slate-400 mb-6">
            The project you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/projects"
            className="px-4 py-2.5 rounded-xl bg-stellar-500 hover:bg-stellar-600 text-white text-xs font-semibold"
          >
            Back to All Projects
          </Link>
        </div>
      </div>
    );
  }

  const deadlineInfo = calculateDaysRemaining(project.deadline);
  const percentage = Math.min(100, Math.round((project.raisedAmount / project.fundingGoal) * 100));
  const totalReleasedFunds = project.milestones
    .filter((m) => m.status === "Funds Released")
    .reduce((sum, m) => sum + (project.fundingGoal * m.percentage) / 100, 0);

  return (
    <div className="min-h-screen py-10 lg:py-16 bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top: Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-300 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/projects" className="hover:text-slate-300 transition-colors">
            Projects
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-300 truncate max-w-xs">{project.title}</span>
        </nav>

        {/* Top Header Card */}
        <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 mb-10 shadow-card">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stellar-500/10 text-stellar-300 border border-stellar-500/20">
              {project.category}
            </span>
            <ProjectStatus status={project.status} />
            <span className="text-xs text-slate-500 ml-auto font-mono">
              Created {formatDate(project.createdAt)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {project.title}
          </h1>

          {project.tagline && (
            <p className="mt-2 text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              {project.tagline}
            </p>
          )}

          {/* Creator & Verifier meta bar */}
          <div className="mt-6 pt-6 border-t border-navy-850 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              <span>Creator:</span>
              <span className="font-mono text-slate-200 bg-navy-800 px-2 py-0.5 rounded border border-navy-750">
                {formatAddress(project.creator, 6)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-stellar-400" />
              <span>Independent Verifier:</span>
              <span className="font-mono text-stellar-300 bg-navy-800 px-2 py-0.5 rounded border border-navy-750">
                {formatAddress(project.verifier, 6)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Deadline:</span>
              <span className="text-slate-200 font-medium">
                {formatDate(project.deadline)} ({deadlineInfo.label})
              </span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* LEFT COLUMN: Description, Milestones, Funding Activities */}
          <div className="lg:col-span-8 space-y-10">
            {/* About / Description Section */}
            <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-card">
              <h2 className="text-xl font-bold text-white mb-4">About the Project</h2>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                <p>{project.description}</p>
              </div>

              {/* Funding summary stats inside left area */}
              <div className="mt-8 pt-6 border-t border-navy-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 rounded-2xl bg-navy-850 border border-navy-800">
                  <div className="text-xs text-slate-400 mb-1">Target Goal</div>
                  <div className="font-bold text-white text-sm sm:text-base">
                    {formatAmount(project.fundingGoal, project.fundingToken)}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-navy-850 border border-navy-800">
                  <div className="text-xs text-slate-400 mb-1">Total Raised</div>
                  <div className="font-bold text-stellar-400 text-sm sm:text-base">
                    {formatAmount(project.raisedAmount, project.fundingToken)}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-navy-850 border border-navy-800">
                  <div className="text-xs text-slate-400 mb-1">Funds Released</div>
                  <div className="font-bold text-emerald-400 text-sm sm:text-base">
                    {formatAmount(totalReleasedFunds, project.fundingToken)}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-navy-850 border border-navy-800">
                  <div className="text-xs text-slate-400 mb-1">Milestones</div>
                  <div className="font-bold text-white text-sm sm:text-base">
                    {project.milestones.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Milestones Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Project Milestones</h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Funds remain locked in Soroban escrow until deliverables are audited and approved.
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-navy-850 px-3 py-1 rounded-full border border-navy-750">
                  {project.milestones.filter((m) => m.status === "Funds Released").length} / {project.milestones.length} completed
                </span>
              </div>

              <div className="space-y-4 pt-2">
                {project.milestones.map((milestone) => (
                  <MilestoneCard
                    key={milestone.id}
                    milestone={milestone}
                    fundingGoal={project.fundingGoal}
                    fundingToken={project.fundingToken}
                  />
                ))}
              </div>
            </div>

            {/* Funding Activity Feed */}
            <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-stellar-400" />
                  <h2 className="text-xl font-bold text-white">Funding Activity</h2>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {project.activities?.length || 0} Transactions
                </span>
              </div>

              {(!project.activities || project.activities.length === 0) ? (
                <p className="text-sm text-slate-500 text-center py-6">
                  No contributions recorded yet. Be the first to back this campaign!
                </p>
              ) : (
                <div className="divide-y divide-navy-800/80">
                  {project.activities.map((act) => (
                    <div
                      key={act.id}
                      className="py-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-navy-800 border border-navy-750 flex items-center justify-center text-stellar-400 font-bold">
                          +
                        </div>
                        <div>
                          <div className="font-mono text-slate-200">
                            {formatAddress(act.contributorAddress, 6)}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {formatDate(act.timestamp)}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-white font-mono">
                          +{formatAmount(act.amount, act.token || project.fundingToken)}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center justify-end gap-1">
                          <span>Tx:</span>
                          <span className="text-stellar-400">{act.txHash.slice(0, 10)}...</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Funding Card & Escrow Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 bg-navy-900 border border-navy-750 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
              {/* Card Header & Raised info */}
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Funding Progress
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {formatAmount(project.raisedAmount, project.fundingToken)}
                  </span>
                  <span className="text-sm font-bold text-stellar-400 font-mono">
                    {percentage}%
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  pledged of {formatAmount(project.fundingGoal, project.fundingToken)} goal
                </div>

                <div className="mt-4">
                  <ProgressBar value={project.raisedAmount} max={project.fundingGoal} size="md" />
                </div>
              </div>

              {/* Status details */}
              <div className="p-3.5 rounded-2xl bg-navy-950 border border-navy-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Campaign Status:</span>
                  <span className="font-medium text-white">{project.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time Remaining:</span>
                  <span className="font-medium text-white">{deadlineInfo.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Escrow Contract:</span>
                  <span className="font-mono text-stellar-400">Soroban Audited</span>
                </div>
              </div>

              {/* Funding Form */}
              <form onSubmit={handleFund} className="space-y-4 pt-2">
                <div>
                  <label htmlFor="fund-amount-input" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Contribution Amount ({project.fundingToken})
                  </label>
                  <div className="relative">
                    <input
                      id="fund-amount-input"
                      type="number"
                      min="1"
                      step="any"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full pl-4 pr-16 py-3 rounded-xl bg-navy-950 border border-navy-750 text-white font-mono text-base focus:outline-none focus:border-stellar-500 transition-colors"
                      disabled={isFunding}
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stellar-400">
                      {project.fundingToken}
                    </div>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="flex gap-2 mt-2">
                    {[100, 250, 500, 1000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setFundAmount(preset.toString())}
                        className="flex-1 py-1 text-xs font-mono font-medium rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-300 border border-navy-700 transition-colors cursor-pointer"
                      >
                        +{preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback Alerts */}
                {fundSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{fundSuccess}</span>
                  </div>
                )}

                {fundError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{fundError}</span>
                  </div>
                )}

                {/* Action Buttons */}
                {!wallet.isConnected ? (
                  <button
                    type="button"
                    onClick={connectWallet}
                    className="w-full py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-stellar-500 to-stellar-600 hover:from-stellar-600 hover:to-stellar-700 shadow-glow-sm hover:shadow-glow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet to Fund</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isFunding}
                    className="w-full py-3.5 rounded-xl font-semibold text-sm text-white bg-stellar-500 hover:bg-stellar-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-sm hover:shadow-glow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>{isFunding ? "Processing Contribution..." : "Fund This Project"}</span>
                  </button>
                )}
              </form>

              {/* Guarantees info box */}
              <div className="pt-4 border-t border-navy-800 text-[11px] text-slate-400 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Soroban Milestone Protection</span>
                </div>
                <p className="leading-normal">
                  Your funds remain secured in the Soroban contract until deliverables are verified. If the campaign fails or milestones are abandoned, contributors can claim pro-rata refunds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
