import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Project } from "../types";
import { getProjects } from "../services/contract";
import { ProjectCard } from "../components/ProjectCard";
import { SectionHeading } from "../components/SectionHeading";
import {
  Shield,
  ArrowRight,
  Sparkles,
  Layers,
  Coins,
  CheckCircle2,
  FileCheck2,
  Eye,
  GitBranch,
  Lock,
  Compass,
  PlusCircle,
} from "lucide-react";

export const Home: React.FC = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects().then((projects) => {
      // Pick top 3 featured
      setFeaturedProjects(projects.slice(0, 3));
    });
  }, []);

  const steps = [
    {
      num: "01",
      title: "Create",
      desc: "Project creators define their funding goal, deadline and milestones with transparent percentages.",
      icon: <Layers className="w-5 h-5 text-stellar-400" />,
    },
    {
      num: "02",
      title: "Fund",
      desc: "Contributors support projects through Stellar assets held securely by the Soroban smart contract.",
      icon: <Coins className="w-5 h-5 text-stellar-400" />,
    },
    {
      num: "03",
      title: "Verify",
      desc: "Designated independent verifiers review submitted proof and evidence for each milestone.",
      icon: <FileCheck2 className="w-5 h-5 text-stellar-400" />,
    },
    {
      num: "04",
      title: "Release",
      desc: "Approved milestone funds are released directly to the creator. If incomplete, refunds are claimable.",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    },
  ];

  const valueProps = [
    {
      title: "Transparent",
      desc: "Every contribution, escrow lock, and verification is permanently traceable on the Stellar ledger.",
      icon: <Eye className="w-6 h-6 text-stellar-400" />,
    },
    {
      title: "Milestone-based",
      desc: "Funds are released in tranches according to verified real-world progress, not all upfront.",
      icon: <Layers className="w-6 h-6 text-stellar-400" />,
    },
    {
      title: "Non-custodial",
      desc: "The backend never holds contributor assets; the audited Soroban contract governs release and refund logic.",
      icon: <Lock className="w-6 h-6 text-stellar-400" />,
    },
    {
      title: "Open source",
      desc: "The system is designed for public review, community governance, and collaborative contribution.",
      icon: <GitBranch className="w-6 h-6 text-stellar-400" />,
    },
  ];

  const timelineNodes = [
    { title: "Funding", desc: "Contributors deposit Stellar assets into contract escrow", icon: <Coins className="w-4 h-4 text-stellar-400" />, status: "Active" },
    { title: "Milestone Submitted", desc: "Creator delivers work and submits verifiable proof", icon: <Layers className="w-4 h-4 text-amber-400" />, status: "Review" },
    { title: "Verifier Review", desc: "Designated auditor examines deliverables against criteria", icon: <FileCheck2 className="w-4 h-4 text-sky-400" />, status: "Audit" },
    { title: "Approved", desc: "Auditor signs cryptographic approval on-chain", icon: <Shield className="w-4 h-4 text-indigo-400" />, status: "Verified" },
    { title: "Funds Released", desc: "Contract tranches funds directly to creator address", icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, status: "Paid" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-navy-800/80 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-stellar-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Col: Hero Copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 text-left space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stellar-500/10 border border-stellar-500/20 text-stellar-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-stellar-400" />
                <span>Next-Gen Public Goods on Stellar &amp; Soroban</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Fund projects with{" "}
                <span className="bg-gradient-to-r from-stellar-400 via-stellar-300 to-stellar-100 bg-clip-text text-transparent">
                  confidence.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 max-w-xl font-normal leading-relaxed">
                ImpactFlow connects contributors with real-world projects through milestone-based funding powered by Stellar.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  to="/projects"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-stellar-500 to-stellar-600 hover:from-stellar-600 hover:to-stellar-700 shadow-glow-md hover:shadow-glow-md transition-all cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Projects</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/create"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-200 hover:text-white bg-navy-850 hover:bg-navy-800 border border-navy-700 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-stellar-400" />
                  <span>Create a Project</span>
                </Link>
              </div>

              {/* Tagline pill */}
              <div className="pt-4 text-xs text-slate-400 font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>&ldquo;Fund projects. Verify progress. Release funds transparently.&rdquo;</span>
              </div>
            </motion.div>

            {/* Right Col: Visual Funding / Milestone Illustration (CSS shapes & cards, no external image URLs) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md p-6 rounded-3xl bg-gradient-to-b from-navy-800 to-navy-850 border border-navy-700/80 shadow-2xl overflow-hidden">
                {/* Accent glow corner */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-stellar-500/20 rounded-full blur-2xl pointer-events-none" />

                {/* Card Top: Mock Campaign Header */}
                <div className="flex items-center justify-between pb-4 border-b border-navy-750">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Smart Escrow Vault</div>
                      <div className="text-[10px] text-slate-400 font-mono">Soroban Contract #7021</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px] font-medium">
                    Verified
                  </span>
                </div>

                {/* Funding Progress Meter */}
                <div className="mt-5 p-4 rounded-2xl bg-navy-900 border border-navy-800">
                  <div className="flex justify-between items-baseline mb-2 text-xs">
                    <span className="text-slate-400">Total Escrowed</span>
                    <span className="text-white font-bold text-sm">11,250 / 15,000 XLM</span>
                  </div>
                  <div className="w-full h-2.5 bg-navy-800 rounded-full overflow-hidden p-0.5">
                    <div className="w-3/4 h-full rounded-full bg-gradient-to-r from-stellar-500 to-stellar-400 shadow-glow-sm" />
                  </div>
                  <div className="mt-2 flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>75% Funded</span>
                    <span>1,875 XLM Released</span>
                  </div>
                </div>

                {/* Interactive Milestone Flow Preview */}
                <div className="mt-4 space-y-2.5">
                  <div className="p-3 rounded-xl bg-navy-850 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-white">Milestone 1: Equipment Sourcing</div>
                        <div className="text-[11px] text-slate-400">30% allocation • Proof verified</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400 font-mono">RELEASED</span>
                  </div>

                  <div className="p-3 rounded-xl bg-navy-850 border border-amber-500/40 flex items-center justify-between text-xs shadow-glow-sm">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                      <div>
                        <div className="font-semibold text-white">Milestone 2: Field Installation</div>
                        <div className="text-[11px] text-amber-200/80">40% allocation • Auditor reviewing</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-amber-400 font-mono">IN REVIEW</span>
                  </div>

                  <div className="p-3 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-mono">3</div>
                      <div>
                        <div className="font-semibold text-slate-400">Milestone 3: Public Auditing</div>
                        <div className="text-[11px] text-slate-500">30% allocation • Pending start</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">LOCKED</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-navy-750 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Independent Verifier:</span>
                  <span className="font-mono text-stellar-400">GCAQ...152</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. TRUST / METRICS STRIP */}
      <section className="py-8 bg-navy-900 border-b border-navy-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-navy-850/50 border border-navy-800">
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">100% Transparent</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">Open ledger verification</div>
            </div>
            <div className="p-4 rounded-2xl bg-navy-850/50 border border-navy-800">
              <div className="text-xl sm:text-2xl font-bold text-stellar-400 tracking-tight">Milestone Releases</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">Progress-based payout</div>
            </div>
            <div className="p-4 rounded-2xl bg-navy-850/50 border border-navy-800">
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">Stellar Powered</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">Sub-second Soroban logic</div>
            </div>
            <div className="p-4 rounded-2xl bg-navy-850/50 border border-navy-800">
              <div className="text-xl sm:text-2xl font-bold text-emerald-400 tracking-tight">100% Non-Custodial</div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">No intermediary risk</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Process"
            title="How ImpactFlow Works"
            subtitle="From initial proposal to milestone approval, funding remains protected by trustless Soroban escrow logic."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="relative bg-navy-850 border border-navy-700/80 rounded-2xl p-6 flex flex-col justify-between hover:border-stellar-500/50 transition-all shadow-card group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-bold text-stellar-400/80 group-hover:text-stellar-300 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS */}
      <section className="py-20 bg-navy-900 border-y border-navy-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stellar-500/10 border border-stellar-500/20 text-stellar-300 text-xs font-semibold uppercase tracking-wider mb-3">
                Featured Campaigns
              </span>
              <h2 className="text-3xl font-bold text-white tracking-tight">Active Public Goods</h2>
              <p className="text-slate-400 mt-2 text-sm sm:text-base">
                Discover verified climate, healthcare, and educational initiatives currently raising capital.
              </p>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-stellar-400 hover:text-stellar-300 transition-colors self-start sm:self-auto"
            >
              <span>View all projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY IMPACTFLOW */}
      <section className="py-20 lg:py-28 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Architecture"
            title="Why ImpactFlow"
            subtitle="Traditional crowdfunding suffers from broken trust and upfront cash drains. We designed an open protocol where funds unlock only upon verified proof."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((prop) => (
              <div
                key={prop.title}
                className="bg-navy-850/80 border border-navy-700/80 rounded-2xl p-6 hover:border-stellar-500/40 transition-all shadow-card"
              >
                <div className="w-12 h-12 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center mb-5">
                  {prop.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{prop.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MILESTONE VISUALIZATION TIMELINE */}
      <section className="py-20 bg-navy-900 border-t border-navy-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Lifecycle"
            title="Milestone Execution Pipeline"
            subtitle="From capital deposit to verified release, each stage is enforced deterministically by the smart contract."
          />

          <div className="relative mt-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {timelineNodes.map((node, i) => (
                <div
                  key={node.title}
                  className="flex flex-col items-center text-center p-5 rounded-2xl bg-navy-850 border border-navy-700 relative group hover:border-stellar-500/50 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    {node.icon}
                  </div>
                  <span className="text-xs font-mono font-semibold text-stellar-400 uppercase tracking-wider mb-1">
                    Step 0{i + 1}
                  </span>
                  <h4 className="text-sm font-bold text-white mb-1.5">{node.title}</h4>
                  <p className="text-xs text-slate-400 leading-normal">{node.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-navy-950 to-navy-900 border-t border-navy-800/80">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stellar-500/10 border border-stellar-500/20 text-stellar-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Source Protocol</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Build something meaningful.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            Create a project, contribute to an idea, or help improve the infrastructure.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/projects"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-stellar-500 hover:bg-stellar-600 transition-all shadow-glow-sm hover:shadow-glow-md"
            >
              Explore Projects
            </Link>
            <Link
              to="/create"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-200 hover:text-white bg-navy-850 hover:bg-navy-800 border border-navy-700 transition-all"
            >
              Create Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
