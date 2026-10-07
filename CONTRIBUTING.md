\# Contributing to ImpactFlow Frontend



Thank you for contributing to ImpactFlow.



This guide explains how to prepare the frontend environment, work on issues, validate changes, and submit pull requests.



\## Before You Start



1\. Read the project `README.md`.

2\. Review existing GitHub issues.

3\. Select an issue that matches your skills.

4\. Check that another contributor is not already working on it.

5\. Comment on the issue with your intended approach.

6\. Wait for maintainer confirmation before starting substantial work.



\## Development Requirements



You need:



\* Node.js 18+

\* pnpm

\* Git



Verify your installation:



```bash

node --version

pnpm --version

git --version

```



\## Setup



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



\## Project Structure



```text

src/

├── components/   # Reusable UI components

├── pages/        # Application pages

├── hooks/        # React hooks

├── services/     # API and Stellar integration

├── store/        # Application state

├── types/        # TypeScript types

└── ...

```



Check existing components and utilities before creating new ones.



\## Branching



Do not work directly on `main`.



Create a focused branch:



```bash

git checkout -b feat/short-description

```



Examples:



```text

feat/project-search

fix/wallet-connection

fix/mobile-dashboard

test/project-card

docs/frontend-setup

```



\## Implementation Guidelines



\### React



\* Prefer functional components.

\* Keep components focused.

\* Reuse existing components where possible.

\* Avoid unnecessary duplication.



\### TypeScript



\* Use meaningful types.

\* Avoid unnecessary `any`.

\* Keep shared types organized.



\### Styling



\* Follow the existing Tailwind CSS patterns.

\* Maintain responsive layouts.

\* Reuse existing design patterns.



\### API and Stellar



Keep API and Stellar communication inside the appropriate service/integration layer.



\### Wallet Security



Never:



\* Request private keys

\* Store private keys

\* Log sensitive wallet information

\* Commit wallet credentials

\* Hard-code secrets



Transaction signing must remain under the user's control through their wallet.



\## Environment Variables



Never commit `.env` files containing secrets.



When a new environment variable is required:



1\. Document its name and purpose.

2\. Add it to `.env.example`.

3\. Never include real credentials.



\## Validation



Before opening a pull request, run:



```bash

pnpm run build

```



The production build must pass.



For UI changes, also check:



\* Desktop layout

\* Tablet layout

\* Loading states

\* Error states

\* Interactive states

\* Wallet behavior where applicable



\## Pull Requests



A pull request should:



\* Reference the relevant issue.

\* Explain the problem.

\* Explain the implementation.

\* Describe testing performed.

\* Include screenshots for significant UI changes.

\* Avoid unrelated changes.

\* Pass the production build.



Example:



```text

\## Summary



Implemented project search and category filtering.



\## Changes



\- Added project search

\- Added category filtering

\- Added empty-state handling

\- Added responsive behavior



\## Validation



\- pnpm run build

\- Tested search and filtering

\- Tested desktop and tablet layouts



Closes #123

```



\## Commit Messages



Use clear commit messages:



```text

feat: add project search

fix: handle wallet connection failure

docs: update frontend setup guide

test: add project card tests

refactor: simplify milestone component

chore: update dependencies

```



\## Definition of Done



A contribution is ready when:



\* The issue requirements are satisfied.

\* Existing functionality still works.

\* The production build passes.

\* Relevant testing has been completed.

\* No secrets or generated files are committed.

\* Documentation is updated where necessary.

\* The pull request clearly explains the changes.



\## Questions



If an issue is unclear, ask questions before implementing a large change.



Thank you for contributing to ImpactFlow.



