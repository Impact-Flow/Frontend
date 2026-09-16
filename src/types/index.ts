export type ProjectStatus = "Funding" | "Funded" | "In Progress" | "Completed";

export type MilestoneStatus =
  | "Pending"
  | "Submitted"
  | "Rejected"
  | "Approved"
  | "Funds Released";

export interface Milestone {
  id: string;
  index: number;
  title: string;
  description: string;
  percentage: number;
  status: MilestoneStatus;
  fundsReleased?: number;
  evidence?: string;
  evidenceUrl?: string;
  submittedDate?: string;
  reviewedDate?: string;
  reviewNotes?: string;
}

export interface FundingActivity {
  id: string;
  contributorAddress: string;
  amount: number;
  timestamp: string;
  txHash: string;
  token?: string;
}

export interface Contributor {
  address: string;
  amount: number;
  timestamp: string;
}

export interface Project {
  id: string;
  title: string;
  tagline?: string;
  category: "Climate" | "Healthcare" | "Education" | "Infrastructure" | "Technology" | string;
  description: string;
  shortDescription: string;
  creator: string;
  verifier: string;
  fundingToken: string;
  fundingGoal: number;
  raisedAmount: number;
  deadline: string;
  status: ProjectStatus;
  milestones: Milestone[];
  createdAt: string;
  activities?: FundingActivity[];
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  network: string;
}
