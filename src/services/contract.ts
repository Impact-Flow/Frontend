/**
 * Soroban Smart Contract Service (Mock / Service Layer)
 *
 * NOTE: This service corresponds directly to the Soroban contract interface:
 * - initialize
 * - create_project
 * - fund_project
 * - submit_milestone
 * - approve_milestone
 * - reject_milestone
 * - release_milestone
 * - request_refund
 * - close_project
 * - get_project
 * - get_milestone
 * - get_contribution
 *
 * It does NOT make real blockchain calls yet. Returns realistic mocked promises
 * and operates over client session mock storage.
 */

import { Project, Milestone, FundingActivity } from "../types";
import { initialProjects } from "../data/mockProjects";

const STORAGE_KEY = "impactflow_projects_store";

function getStoredProjects(): Project[] {
  if (typeof window === "undefined") return initialProjects;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProjects));
      return initialProjects;
    }
    return JSON.parse(data);
  } catch {
    return initialProjects;
  }
}

function saveStoredProjects(projects: Project[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export interface CreateProjectParams {
  title: string;
  category: string;
  description: string;
  shortDescription: string;
  fundingToken: string;
  fundingGoal: number;
  deadline: string;
  verifier: string;
  milestones: Array<{
    title: string;
    description: string;
    percentage: number;
  }>;
}

export interface ContractResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  txHash?: string;
}

/**
 * Fetches all active projects from the mock store.
 */
export async function getProjects(): Promise<Project[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return getStoredProjects();
}

/**
 * Fetches a single project by ID.
 */
export async function getProject(id: string): Promise<Project | null> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const projects = getStoredProjects();
  return projects.find((p) => p.id === id) || null;
}

/**
 * Corresponds to contract method: `create_project`
 * Validates requirements and persists the new project.
 */
export async function createProject(params: CreateProjectParams): Promise<ContractResponse<Project>> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const totalPercentage = params.milestones.reduce((acc, m) => acc + m.percentage, 0);
  if (totalPercentage !== 100) {
    throw new Error(`Total milestone allocation must equal 100%, currently ${totalPercentage}%`);
  }

  const projects = getStoredProjects();
  const newId = `proj-${Date.now().toString(36)}`;
  
  const formattedMilestones: Milestone[] = params.milestones.map((m, idx) => ({
    id: `m-${newId}-${idx + 1}`,
    index: idx + 1,
    title: m.title || `Milestone ${idx + 1}`,
    description: m.description,
    percentage: m.percentage,
    status: "Pending",
    fundsReleased: 0,
  }));

  const newProject: Project = {
    id: newId,
    title: params.title,
    category: params.category,
    description: params.description,
    shortDescription: params.shortDescription || params.description.slice(0, 140) + "...",
    creator: "GCIK7VHYPX7OAW627YI26R6T5N6F62F3PAB2436AZEI7KLPX42RUMOCK",
    verifier: params.verifier,
    fundingToken: params.fundingToken || "XLM",
    fundingGoal: params.fundingGoal,
    raisedAmount: 0,
    deadline: params.deadline,
    status: "Funding",
    milestones: formattedMilestones,
    createdAt: new Date().toISOString(),
    activities: [],
  };

  projects.unshift(newProject);
  saveStoredProjects(projects);

  return {
    success: true,
    message: "Project successfully created on Soroban (mock)",
    data: newProject,
    txHash: `0x${Math.random().toString(16).slice(2, 18)}...`,
  };
}

/**
 * Corresponds to contract method: `fund_project`
 * Simulates depositing Stellar assets into escrow for a project.
 */
export async function fundProject(
  projectId: string,
  amount: number,
  contributorAddress?: string
): Promise<ContractResponse<{ newTotal: number; status: Project["status"] }>> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (amount <= 0) {
    throw new Error("Funding amount must be greater than zero");
  }

  const projects = getStoredProjects();
  const projectIndex = projects.findIndex((p) => p.id === projectId);
  if (projectIndex === -1) {
    throw new Error("Project not found");
  }

  const project = projects[projectIndex];
  const updatedRaised = project.raisedAmount + amount;
  const isFunded = updatedRaised >= project.fundingGoal;
  const newStatus = isFunded ? (project.status === "Funding" ? "Funded" : project.status) : project.status;

  const activity: FundingActivity = {
    id: `tx-${Date.now()}`,
    contributorAddress: contributorAddress || "GCIK7VHYPX7OAW627YI26R6T5N6F62F3PAB2436AZEI7KLPX42RUMOCK",
    amount,
    timestamp: new Date().toISOString(),
    txHash: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`,
    token: project.fundingToken,
  };

  project.raisedAmount = updatedRaised;
  project.status = newStatus;
  project.activities = [activity, ...(project.activities || [])];

  projects[projectIndex] = project;
  saveStoredProjects(projects);

  return {
    success: true,
    message: `Successfully contributed ${amount} ${project.fundingToken}`,
    data: { newTotal: updatedRaised, status: newStatus },
    txHash: activity.txHash,
  };
}

/**
 * Corresponds to contract method: `submit_milestone`
 * Submits deliverable evidence for verifier review.
 */
export async function submitMilestone(
  projectId: string,
  milestoneIndex: number,
  evidence: string
): Promise<ContractResponse<Milestone>> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const projects = getStoredProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) throw new Error("Project not found");

  const milestone = project.milestones.find((m) => m.index === milestoneIndex);
  if (!milestone) throw new Error("Milestone not found");

  milestone.status = "Submitted";
  milestone.evidence = evidence;
  milestone.submittedDate = new Date().toISOString();

  saveStoredProjects(projects);

  return {
    success: true,
    message: `Milestone #${milestoneIndex} submitted for verification`,
    data: milestone,
  };
}

/**
 * Corresponds to contract method: `approve_milestone`
 * Verifier approves the submitted deliverables.
 */
export async function approveMilestone(
  projectId: string,
  milestoneIndex: number
): Promise<ContractResponse<Milestone>> {
  await new Promise((resolve) => setTimeout(resolve, 450));

  const projects = getStoredProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) throw new Error("Project not found");

  const milestone = project.milestones.find((m) => m.index === milestoneIndex);
  if (!milestone) throw new Error("Milestone not found");

  milestone.status = "Approved";
  milestone.reviewedDate = new Date().toISOString();

  // If status is Funded or In Progress, maintain proper state
  if (project.status === "Funded") {
    project.status = "In Progress";
  }

  saveStoredProjects(projects);

  return {
    success: true,
    message: `Milestone #${milestoneIndex} approved by verifier`,
    data: milestone,
  };
}

/**
 * Corresponds to contract method: `reject_milestone`
 * Verifier rejects deliverables with reason.
 */
export async function rejectMilestone(
  projectId: string,
  milestoneIndex: number,
  reason: string
): Promise<ContractResponse<Milestone>> {
  await new Promise((resolve) => setTimeout(resolve, 450));

  const projects = getStoredProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) throw new Error("Project not found");

  const milestone = project.milestones.find((m) => m.index === milestoneIndex);
  if (!milestone) throw new Error("Milestone not found");

  milestone.status = "Rejected";
  milestone.reviewNotes = reason;
  milestone.reviewedDate = new Date().toISOString();

  saveStoredProjects(projects);

  return {
    success: true,
    message: `Milestone #${milestoneIndex} rejected`,
    data: milestone,
  };
}

/**
 * Corresponds to contract method: `release_milestone`
 * Releases unlocked escrow funds to the creator.
 */
export async function releaseMilestone(
  projectId: string,
  milestoneIndex: number
): Promise<ContractResponse<{ milestone: Milestone; releasedAmount: number }>> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const projects = getStoredProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) throw new Error("Project not found");

  const milestone = project.milestones.find((m) => m.index === milestoneIndex);
  if (!milestone) throw new Error("Milestone not found");

  const payoutAmount = (project.fundingGoal * milestone.percentage) / 100;
  milestone.status = "Funds Released";
  milestone.fundsReleased = payoutAmount;

  // Check if all milestones are completed
  const allReleased = project.milestones.every((m) => m.status === "Funds Released");
  if (allReleased) {
    project.status = "Completed";
  } else {
    project.status = "In Progress";
  }

  saveStoredProjects(projects);

  return {
    success: true,
    message: `Released ${payoutAmount} ${project.fundingToken} for Milestone #${milestoneIndex}`,
    data: { milestone, releasedAmount: payoutAmount },
  };
}

/**
 * Corresponds to contract method: `request_refund`
 * Allows contributors to claim a pro-rata refund if the project failed or expired.
 */
export async function requestRefund(
  projectId: string,
  contributorAddress?: string
): Promise<ContractResponse<{ refundAmount: number }>> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const projects = getStoredProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) throw new Error("Project not found");

  // Calculate unreleased proportion of funds
  const totalReleased = project.milestones
    .filter((m) => m.status === "Funds Released")
    .reduce((sum, m) => sum + (project.fundingGoal * m.percentage) / 100, 0);

  const refundablePool = Math.max(0, project.raisedAmount - totalReleased);

  return {
    success: true,
    message: `Refund claimed for address ${contributorAddress || "caller"}: ${refundablePool.toFixed(2)} ${project.fundingToken} returned.`,
    data: { refundAmount: refundablePool },
    txHash: `0xrefund_${Math.random().toString(16).slice(2, 10)}`,
  };
}
