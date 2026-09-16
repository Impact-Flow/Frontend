import React from "react";
import { Link } from "react-router-dom";
import { Project } from "../types";
import { ProgressBar } from "./ProgressBar";
import { ProjectStatus } from "./ProjectStatus";
import { formatAmount, formatAddress, calculateDaysRemaining } from "../lib/utils";
import { Calendar, User, ArrowRight, ShieldCheck } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const deadlineInfo = calculateDaysRemaining(project.deadline);
  const percentage = Math.min(100, Math.round((project.raisedAmount / project.fundingGoal) * 100));

  // Category badges with custom accent tints
  const categoryTints: Record<string, string> = {
    Climate: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    Healthcare: "text-rose-300 bg-rose-500/10 border-rose-500/20",
    Infrastructure: "text-sky-300 bg-sky-500/10 border-sky-500/20",
    Education: "text-indigo-300 bg-indigo-500/10 border-indigo-500/20",
    Technology: "text-purple-300 bg-purple-500/10 border-purple-500/20",
  };

  const categoryClass = categoryTints[project.category] || "text-slate-300 bg-navy-800 border-navy-700";

  return (
    <div className="group flex flex-col justify-between h-full bg-navy-850 hover:bg-navy-800/90 border border-navy-700/80 hover:border-stellar-500/40 rounded-2xl p-6 transition-all duration-300 shadow-card hover:shadow-glow-sm">
      <div>
        {/* Top meta strip */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${categoryClass}`}>
            {project.category}
          </span>
          <ProjectStatus status={project.status} size="sm" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-stellar-300 transition-colors line-clamp-1">
          <Link to={`/projects/${project.id}`} className="focus:outline-none focus:underline">
            {project.title}
          </Link>
        </h3>

        {/* Short description */}
        <p className="mt-2.5 text-sm text-slate-400 line-clamp-2 leading-relaxed">
          {project.shortDescription || project.description}
        </p>

        {/* Creator & Verifier meta */}
        <div className="mt-4 pt-3.5 border-t border-navy-750/70 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5" title={`Creator: ${project.creator}`}>
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>by <span className="font-mono text-slate-300">{formatAddress(project.creator)}</span></span>
          </div>
          <div className="flex items-center gap-1 text-slate-400" title="Milestone-verified by independent auditor">
            <ShieldCheck className="w-3.5 h-3.5 text-stellar-400" />
            <span className="text-[11px] text-slate-400">{project.milestones.length} Milestones</span>
          </div>
        </div>
      </div>

      {/* Financial Progress Area */}
      <div className="mt-6 pt-4 border-t border-navy-750/70">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-lg font-bold text-white tracking-tight">
              {formatAmount(project.raisedAmount, project.fundingToken)}
            </span>
            <span className="text-xs text-slate-400 ml-1.5">
              raised of {formatAmount(project.fundingGoal, project.fundingToken)}
            </span>
          </div>
          <span className="text-xs font-semibold text-stellar-400 font-mono">
            {percentage}%
          </span>
        </div>

        <ProgressBar value={project.raisedAmount} max={project.fundingGoal} size="sm" />

        {/* Footer info & CTA button */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{deadlineInfo.label}</span>
          </div>

          <Link
            to={`/projects/${project.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stellar-400 hover:text-stellar-300 group-hover:translate-x-0.5 transition-all focus:outline-none focus:ring-1 focus:ring-stellar-500 rounded px-1.5 py-0.5"
          >
            <span>View Project</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
