import React, { useState, useEffect, useMemo } from "react";
import { Project, ProjectStatus } from "../types";
import { getProjects } from "../services/contract";
import { ProjectCard } from "../components/ProjectCard";
import { Search, Filter, Compass, AlertCircle, RefreshCw } from "lucide-react";

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const categories = ["All", "Climate", "Healthcare", "Education", "Infrastructure", "Technology"];
  const statuses: Array<"All" | ProjectStatus> = ["All", "Funding", "Funded", "In Progress", "Completed"];

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Category match
      const categoryMatch =
        selectedCategory === "All" || p.category.toLowerCase() === selectedCategory.toLowerCase();

      // Status match
      const statusMatch = selectedStatus === "All" || p.status === selectedStatus;

      // Search match
      const query = searchTerm.toLowerCase().trim();
      const searchMatch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);

      return categoryMatch && statusMatch && searchMatch;
    });
  }, [projects, selectedCategory, selectedStatus, searchTerm]);

  return (
    <div className="min-h-screen py-10 lg:py-16 bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stellar-500/10 border border-stellar-500/20 text-stellar-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Discover Initiatives</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Browse Impact Campaigns
          </h1>
          <p className="mt-2.5 text-base sm:text-lg text-slate-400 leading-relaxed">
            Support verifiable public good projects with transparent milestone releases on Stellar.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-card space-y-4">
          {/* Top: Search input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by project name, description, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-navy-750 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-stellar-500 transition-colors"
            />
          </div>

          {/* Bottom: Filters row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-navy-800/80">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <span className="text-xs text-slate-500 font-medium mr-1 shrink-0 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-stellar-500 text-white shadow-glow-sm"
                      : "bg-navy-850 text-slate-400 hover:text-white border border-navy-750 hover:bg-navy-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <span className="text-xs text-slate-500 font-medium mr-1 shrink-0">Status:</span>
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedStatus === st
                      ? "bg-navy-700 text-white border border-stellar-400/40"
                      : "bg-navy-850 text-slate-400 hover:text-white border border-navy-750 hover:bg-navy-800"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter & Refresh */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-400">
          <span>Showing {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}</span>
          {(searchTerm || selectedCategory !== "All" || selectedStatus !== "All") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedStatus("All");
              }}
              className="flex items-center gap-1 text-stellar-400 hover:text-stellar-300 font-medium cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Project Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="h-80 rounded-2xl bg-navy-850 animate-pulse border border-navy-800"
              />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-navy-900 rounded-3xl border border-navy-800 p-8 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-navy-800 border border-navy-700 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No projects found</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              We couldn&apos;t find any campaigns matching your current search and filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedStatus("All");
              }}
              className="px-4 py-2 rounded-xl bg-stellar-500 hover:bg-stellar-600 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
