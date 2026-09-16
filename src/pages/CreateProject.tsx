import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../services/contract";
import {
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

interface MilestoneInput {
  title: string;
  description: string;
  percentage: number;
}

export const CreateProject: React.FC = () => {
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Climate");
  const [fundingToken, setFundingToken] = useState("XLM");
  const [fundingGoal, setFundingGoal] = useState<string>("10000");
  const [deadline, setDeadline] = useState("");
  const [verifier, setVerifier] = useState(
    "GCVERIFIER99CLIMATEAUDITX42ORGANIZATIONSTEL999"
  );

  const [milestones, setMilestones] = useState<MilestoneInput[]>([
    {
      title: "Phase 1: Architecture & Sourcing",
      description: "Complete core architecture, site survey, and equipment acquisition.",
      percentage: 30,
    },
    {
      title: "Phase 2: Deployment & Construction",
      description: "Execute field assembly, physical build, and preliminary unit tests.",
      percentage: 40,
    },
    {
      title: "Phase 3: Public Verification & Auditing",
      description: "Finalize deployment, publish telemetry data, and release documentation.",
      percentage: 30,
    },
  ]);

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSuccess, setCreatedSuccess] = useState<{
    id: string;
    txHash: string;
  } | null>(null);

  const categories = ["Climate", "Healthcare", "Education", "Infrastructure", "Technology", "Community"];
  const tokens = ["XLM", "USDC"];

  // Milestone management
  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        title: `Phase ${milestones.length + 1}: Deliverables`,
        description: "",
        percentage: 0,
      },
    ]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((_, idx) => idx !== index));
  };

  const updateMilestone = (index: number, field: keyof MilestoneInput, value: string | number) => {
    const updated = [...milestones];
    updated[index] = {
      ...updated[index],
      [field]: field === "percentage" ? Number(value) : value,
    };
    setMilestones(updated);
  };

  const totalAllocation = milestones.reduce((sum, m) => sum + (Number(m.percentage) || 0), 0);

  // Validation
  const validate = (): boolean => {
    const errs: string[] = [];
    if (!title.trim()) errs.push("Project name is required.");
    if (!description.trim()) errs.push("Project description is required.");
    const goalNum = parseFloat(fundingGoal);
    if (isNaN(goalNum) || goalNum <= 0) errs.push("Funding goal must be greater than zero.");
    if (!deadline) errs.push("Project deadline is required.");
    if (!verifier.trim()) errs.push("Verifier address is required.");
    if (milestones.length < 1) errs.push("At least one milestone is required.");
    
    // Check milestone details
    milestones.forEach((m, idx) => {
      if (!m.description.trim()) {
        errs.push(`Milestone #${idx + 1} requires a description.`);
      }
      if (m.percentage <= 0) {
        errs.push(`Milestone #${idx + 1} percentage must be greater than 0%.`);
      }
    });

    if (totalAllocation !== 100) {
      errs.push(`Milestone percentages must total exactly 100% (currently ${totalAllocation}%).`);
    }

    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      const res = await createProject({
        title,
        category,
        description,
        shortDescription: description.slice(0, 140) + "...",
        fundingToken,
        fundingGoal: parseFloat(fundingGoal),
        deadline,
        verifier,
        milestones,
      });

      if (res.data) {
        setCreatedSuccess({
          id: res.data.id,
          txHash: res.txHash || "0xsimulated_soroban_tx",
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create project";
      setErrors([message]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 lg:py-16 bg-navy-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stellar-500/10 border border-stellar-500/20 text-stellar-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campaign Creation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Launch a Verified Milestone Campaign
          </h1>
          <p className="mt-2 text-base text-slate-400">
            Define your funding requirements, set escrow deadlines, and configure verifiable milestones for Stellar contributors.
          </p>
        </div>

        {/* Success Modal / Banner if created */}
        {createdSuccess ? (
          <div className="bg-navy-900 border border-emerald-500/40 rounded-3xl p-8 text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">Campaign Successfully Created!</h2>
              <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
                Your milestone-based crowdfunding proposal is now initialized in the mock Soroban contract state.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-navy-950 border border-navy-800 max-w-md mx-auto text-left text-xs font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Project ID:</span>
                <span className="text-white">{createdSuccess.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mock Tx Hash:</span>
                <span className="text-stellar-400">{createdSuccess.txHash}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Milestone Tranches:</span>
                <span className="text-emerald-400">{milestones.length} Configured (100%)</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate(`/projects/${createdSuccess.id}`)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-white bg-stellar-500 hover:bg-stellar-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Project Page</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCreatedSuccess(null);
                  setTitle("");
                  setDescription("");
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-slate-300 hover:text-white bg-navy-850 border border-navy-750 transition-colors cursor-pointer"
              >
                Create Another Project
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error notifications */}
            {errors.length > 0 && (
              <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-rose-300 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm text-rose-200">
                  <AlertCircle className="w-4 h-4" />
                  <span>Please resolve the following before proceeding:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 pl-2 text-rose-300">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* SECTION 1: Basic Campaign Details */}
            <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-navy-800">
                <Layers className="w-5 h-5 text-stellar-400" />
                <h2 className="text-lg font-bold text-white">1. Project Overview</h2>
              </div>

              {/* Project Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Project Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Community Solar Hub"
                  className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-navy-750 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-stellar-500 transition-colors"
                />
              </div>

              {/* Category & Funding Token */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-navy-750 text-white text-sm focus:outline-none focus:border-stellar-500 transition-colors"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Funding Token <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={fundingToken}
                    onChange={(e) => setFundingToken(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-navy-750 text-white text-sm focus:outline-none focus:border-stellar-500 transition-colors"
                  >
                    {tokens.map((tok) => (
                      <option key={tok} value={tok}>
                        {tok} (Stellar Native/Asset)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Project Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide full details on the public good purpose, beneficiaries, engineering architecture, and execution plan..."
                  className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-navy-750 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-stellar-500 transition-colors"
                />
              </div>
            </div>

            {/* SECTION 2: Financial & Escrow Parameters */}
            <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-navy-800">
                <Calendar className="w-5 h-5 text-stellar-400" />
                <h2 className="text-lg font-bold text-white">2. Escrow &amp; Target Goal</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Funding Goal */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Funding Goal ({fundingToken}) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={fundingGoal}
                    onChange={(e) => setFundingGoal(e.target.value)}
                    placeholder="e.g. 10000"
                    className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-navy-750 text-white font-mono text-sm focus:outline-none focus:border-stellar-500 transition-colors"
                  />
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Campaign Deadline <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-navy-750 text-white text-sm focus:outline-none focus:border-stellar-500 transition-colors"
                  />
                </div>
              </div>

              {/* Verifier Address */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Designated Verifier Address <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-stellar-400" />
                    Independent Auditor
                  </span>
                </div>
                <input
                  type="text"
                  value={verifier}
                  onChange={(e) => setVerifier(e.target.value)}
                  placeholder="G..."
                  className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-navy-750 text-white font-mono text-xs focus:outline-none focus:border-stellar-500 transition-colors"
                />
                <p className="mt-1.5 text-[11px] text-slate-500">
                  The Stellar public key authorized to review evidence and sign milestone unlock transactions.
                </p>
              </div>
            </div>

            {/* SECTION 3: Milestones Setup */}
            <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-navy-800">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-stellar-400" />
                  <h2 className="text-lg font-bold text-white">3. Milestone Tranches</h2>
                </div>

                {/* Total allocation meter */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
                    totalAllocation === 100
                      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-300 border-rose-500/30"
                  }`}
                >
                  <span>Total Allocation:</span>
                  <span className="text-sm font-bold">{totalAllocation}%</span>
                  <span>{totalAllocation === 100 ? "✓ (Balanced)" : "(Must be 100%)"}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                Define the verifiable delivery checkpoints. Contributors only release funds once the auditor confirms these deliverables.
              </p>

              {/* Milestone items list */}
              <div className="space-y-4">
                {milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-navy-950 border border-navy-800 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-stellar-400 px-2.5 py-0.5 rounded-lg bg-navy-850 border border-navy-750">
                        Milestone #{idx + 1}
                      </span>
                      {milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMilestone(idx)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          aria-label={`Delete milestone ${idx + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-8">
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          Milestone Title
                        </label>
                        <input
                          type="text"
                          value={m.title}
                          onChange={(e) => updateMilestone(idx, "title", e.target.value)}
                          placeholder="e.g. Hardware procurement & engineering blueprints"
                          className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-750 text-white text-xs focus:outline-none focus:border-stellar-500"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-medium text-slate-400 mb-1">
                          Allocation (%)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={m.percentage}
                            onChange={(e) => updateMilestone(idx, "percentage", e.target.value)}
                            className="w-full pl-3 pr-8 py-2 rounded-xl bg-navy-900 border border-navy-750 text-white font-mono text-xs focus:outline-none focus:border-stellar-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                            %
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Verifiable Deliverable Description
                      </label>
                      <textarea
                        rows={2}
                        value={m.description}
                        onChange={(e) => updateMilestone(idx, "description", e.target.value)}
                        placeholder="Specify exact proofs required (e.g. open source repo release, engineering sign-off, or photos)..."
                        className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-750 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-stellar-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Add milestone button */}
              <button
                type="button"
                onClick={addMilestone}
                className="w-full py-3 rounded-xl border border-dashed border-navy-700 hover:border-stellar-500/60 bg-navy-950 hover:bg-navy-900 text-xs font-semibold text-stellar-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Milestone</span>
              </button>
            </div>

            {/* Submit Bar */}
            <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-stellar-400 shrink-0" />
                <span>
                  UI / Mock preview only. No smart contract fees or gas will be charged.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-stellar-500 to-stellar-600 hover:from-stellar-600 hover:to-stellar-700 shadow-glow-sm hover:shadow-glow-md disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSubmitting ? "Creating Campaign..." : "Create Project Proposal"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
