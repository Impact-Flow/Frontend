# ImpactFlow — Frontend

> React + TypeScript + Vite + Tailwind CSS

This directory contains the ImpactFlow web application. It is the primary user-facing layer of the platform, responsible for all interaction between human users and the ImpactFlow smart contract on Stellar/Soroban.

---

## Table of Contents

- [Responsibilities](#responsibilities)
- [Planned Technology Stack](#planned-technology-stack)
- [Application Modules](#application-modules)
- [Wallet Integration](#wallet-integration)
- [Development Goals](#development-goals)
- [Design Principles](#design-principles)
- [Getting Started](#getting-started)

---

## Responsibilities

The frontend is the sole interface through which users interact with ImpactFlow. It is responsible for:

### Project Discovery
- Browse all published, open projects
- Search projects by title, category, or creator
- Filter by status (OPEN, FUNDED, IN_PROGRESS, COMPLETED)
- Display project metadata, funding progress, deadline, and milestone overview

### Wallet Connection
- Integrate with Freighter (and other Stellar-compatible wallets)
- Display connected wallet address and XLM balance
- Prompt wallet signing for all on-chain transactions
- Handle wallet errors, rejection events, and network switching gracefully

### Project Creation
- Multi-step form allowing creators to define:
  - Project title, description, category, and banner image
  - Funding goal and contribution deadline
  - Ordered milestone list (each with description and fund allocation percentage)
  - Verifier wallet address
- Client-side validation before any on-chain submission
- Upload project metadata to the backend before registering on-chain

### Funding
- Allow contributors to select a contribution amount
- Preview the transaction before signing
- Submit the signed transaction to the Stellar network
- Display real-time confirmation status

### Milestone Tracking
- Display an ordered timeline of milestones for any project
- Show the current state of each milestone (PENDING, SUBMITTED, APPROVED, REJECTED, FUNDS_RELEASED)
- Link to off-chain evidence submitted for each milestone
- Update milestone states in real time by polling or subscribing to backend events

### Creator Dashboard
- Overview of all projects created by the connected wallet
- Per-project: funding progress, milestone status, earned funds
- Evidence submission interface: upload links, documents, or descriptions for milestone completion
- Milestone resubmission after verifier rejection

### Contributor Dashboard
- Overview of all projects the connected wallet has contributed to
- Per-project: amount contributed, milestone progress, estimated completion
- Refund eligibility indicator and claim refund action for failed projects

### Verifier Dashboard
- Overview of all projects where the connected wallet is the designated verifier
- Per-milestone: view submitted evidence, approve or reject with optional feedback note
- Approval history and audit trail

---

## Planned Technology Stack

| Technology            | Role                                                        |
|-----------------------|-------------------------------------------------------------|
| **React 18**          | UI component framework                                      |
| **TypeScript**        | Static typing for reliability and developer experience      |
| **Vite**              | Fast development server and production bundler              |
| **Tailwind CSS**      | Utility-first styling                                       |
| **React Router**      | Client-side routing between pages and dashboards            |
| **Stellar SDK (JS)**  | Construct and submit Soroban transactions                   |
| **Freighter API**     | Wallet connection and transaction signing                   |
| **React Query**       | Server state management, caching, and background refetching |
| **Zustand**           | Lightweight global state (wallet session, UI state)         |
| **Axios**             | HTTP client for backend API calls                           |
| **Zod**               | Runtime schema validation for forms and API responses       |
| **Vitest**            | Unit and component testing                                  |
| **Playwright**        | End-to-end browser testing                                  |

---

## Application Modules

```
Frontend/
  src/
    pages/
      Home/           -- Project discovery and featured projects
      ProjectDetail/  -- Full project view with milestone timeline
      CreateProject/  -- Multi-step project creation flow
      CreatorDash/    -- Creator dashboard
      ContributorDash/-- Contributor dashboard
      VerifierDash/   -- Verifier dashboard
    components/
      common/         -- Buttons, inputs, modals, badges
      project/        -- ProjectCard, MilestoneTimeline, FundingBar
      wallet/         -- WalletConnectButton, WalletStatus
      forms/          -- CreateProjectForm, MilestoneEvidenceForm
    hooks/
      useWallet       -- Wallet connection and signing helpers
      useProject      -- Project data fetching and mutation
      useMilestone    -- Milestone state and evidence submission
    services/
      api.ts          -- Backend REST client
      stellar.ts      -- Stellar SDK helpers and contract calls
    store/
      walletStore     -- Connected wallet global state
    types/
      index.ts        -- Shared TypeScript types and interfaces
```

---

## Wallet Integration

The frontend never stores, processes, or transmits private keys. All transaction signing is handled by the user`s wallet extension:

1. The frontend constructs a Soroban transaction using the Stellar JavaScript SDK.
2. The unsigned transaction is passed to the Freighter API for user review and signing.
3. The signed transaction XDR is submitted to the Stellar network via Horizon or Soroban RPC.
4. The frontend polls or subscribes for confirmation and updates UI accordingly.

---

## Development Goals

- **Non-custodial by design.** The frontend must never hold or have access to user funds or private keys.
- **Progressive disclosure.** New users should be able to browse projects without connecting a wallet. A wallet is required only for transactional actions.
- **Optimistic UI.** Show immediate feedback on user actions (e.g., contribution submitted) before on-chain confirmation arrives.
- **Accessibility.** WCAG 2.1 AA compliance for all interactive components.
- **Responsive layout.** Full functionality on desktop and tablet; read-only browsing on mobile.
- **Error resilience.** Graceful handling of wallet disconnects, network failures, and contract errors with human-readable messages.

---

## Design Principles

- Clean, modern interface that builds trust through transparency.
- Milestone timelines should feel like progress stories, not technical state machines.
- Financial data (amounts, percentages, deadlines) must be unambiguous and always clearly labelled.
- On-chain confirmation statuses must be clearly distinguished from off-chain states.

---

## Getting Started

> Dependencies have not yet been installed. This section will be updated in Phase 3.

```bash
# From the Frontend/ directory
npm install
npm run dev
```

See the root [`README.md`](../README.md) for the full development roadmap.
