# ImpactFlow — Frontend

> The user-facing web application for ImpactFlow, a decentralized milestone-based funding platform built on Stellar/Soroban.

ImpactFlow enables project creators to define funded projects and milestones, contributors to support projects, and designated verifiers to review milestone evidence and approve releases.

This repository contains the frontend application that connects users to the ImpactFlow backend and Soroban smart contract.

## Project Architecture

ImpactFlow is organized into three coordinated repositories:

| Repository         | Responsibility                                                                |
| ------------------ | ----------------------------------------------------------------------------- |
| **Frontend**       | User interface, wallet interactions, project dashboards and transaction flows |
| **Backend**        | Off-chain API, project metadata, evidence and supporting application services |
| **Smart Contract** | On-chain project, contribution, milestone and fund-release logic              |

## Technology Stack

* **React 18**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **pnpm**
* **Stellar / Soroban**
* **Freighter-compatible wallet integration**

## Core Responsibilities

The frontend provides interfaces for:

### Project Discovery

* Browse available projects
* Search and filter projects
* View project descriptions and funding goals
* View milestone structure and progress
* Display project deadlines and funding status

### Wallet Integration

* Connect a Stellar-compatible wallet
* Display connected wallet information
* Request user authorization for transactions
* Handle wallet connection and transaction errors
* Never access or store users' private keys

### Project Creation

Project creators can define:

* Project title and description
* Project category
* Funding target
* Contribution deadline
* Ordered milestones
* Milestone allocation percentages
* Designated verifier

Client-side validation is performed before submitting project data.

### Project Funding

Contributors can:

* Select a contribution amount
* Review transaction details
* Sign transactions through their wallet
* Submit transactions to the Stellar network
* Monitor transaction confirmation

### Milestone Tracking

The interface provides visibility into milestone states including:

* `PENDING`
* `SUBMITTED`
* `APPROVED`
* `REJECTED`
* `FUNDS_RELEASED`

Milestone evidence and progress are presented alongside the relevant project information.

### Creator Dashboard

Creators can:

* View projects associated with their wallet
* Monitor funding progress
* Track milestone status
* Submit milestone evidence
* Respond to rejected milestones

### Contributor Dashboard

Contributors can:

* View projects they have supported
* Track project and milestone progress
* View contribution information
* Monitor refund eligibility where applicable

### Verifier Dashboard

Designated verifiers can:

* Review assigned projects
* Inspect submitted milestone evidence
* Approve or reject milestones
* Provide feedback
* Review milestone history

## Application Structure

```text
Frontend/
├── public/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Application pages and views
│   ├── hooks/           # Reusable React hooks
│   ├── services/        # API and Stellar integration
│   ├── store/           # Application state
│   ├── types/           # Shared TypeScript types
│   └── ...
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Prerequisites

Before running the project locally, make sure you have:

* Node.js 18+
* pnpm
* Git

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Impact-Flow/Frontend.git
cd Frontend
```

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm run dev
```

The Vite development server will provide the local application URL in the terminal.

## Production Build

To verify the application can be compiled for production:

```bash
pnpm run build
```

The build performs TypeScript compilation followed by a Vite production build.

### Current Build Verification

The frontend has been successfully verified with:

```text
pnpm run build
✓ TypeScript compilation
✓ 1927 modules transformed
✓ Vite production build
✓ Production assets generated
```

Generated build files are intentionally excluded from version control.

## Environment Configuration

Environment-specific configuration should be stored in local `.env` files.

Do not commit:

* API keys
* private keys
* wallet secrets
* authentication secrets
* other sensitive credentials

If environment variables are introduced as the application develops, document their purpose in `.env.example` without including real credentials.

## Wallet Security

ImpactFlow follows a non-custodial frontend architecture.

The frontend:

* Does not store private keys
* Does not request users' secret keys
* Does not custody user funds
* Requests transaction signing through the user's wallet
* Displays transaction information before authorization

Users remain responsible for reviewing and approving transactions through their wallet.

## Development Principles

Contributors working on the frontend should prioritize:

### Type Safety

Use TypeScript types and avoid unnecessary `any` usage.

### Component Reuse

Reusable UI behavior should be implemented as components or hooks rather than duplicated across pages.

### Accessibility

Interactive elements should be keyboard accessible and provide meaningful labels and feedback.

### Responsive Design

Interfaces should work across supported desktop and tablet screen sizes.

### Error Handling

Network, wallet and transaction failures should provide clear, actionable feedback to users.

### Security

Never expose secrets or private keys in frontend code.

### Maintainability

Keep components focused and organize functionality according to the existing project structure.

## Contributing

Contributions are welcome.

Before starting work:

1. Read `CONTRIBUTING.md`.
2. Check existing GitHub issues.
3. Select an issue that matches your skills.
4. Comment on the issue describing your intended approach.
5. Wait for maintainer confirmation before beginning substantial work.
6. Create a focused branch for your contribution.
7. Keep pull requests small and related to one issue.

Every contribution should preserve existing functionality and include appropriate validation or testing where applicable.

## Pull Request Expectations

A pull request should:

* Clearly explain the problem being solved
* Reference the relevant issue
* Describe the implementation
* Include screenshots for significant UI changes
* Avoid unrelated changes
* Pass the production build
* Avoid committing generated files or secrets

## Repository Hygiene

The following generated or local files are intentionally excluded from Git:

```text
node_modules/
dist/
.env
.env.*
```

Dependencies are restored with:

```bash
pnpm install
```

Production assets are generated with:

```bash
pnpm run build
```

## Related Repositories

* **Backend:** https://github.com/Impact-Flow/Backend
* **Smart Contract:** https://github.com/Impact-Flow/Smart-contract

## License

See the repository license file for licensing information.
