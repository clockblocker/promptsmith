# Promptsmith

A local-first prompt engineering tool for designing, testing, and iterating on AI prompts.

## Purpose

Promptsmith helps developers and prompt engineers craft better AI prompts through a structured workflow. All data stays on your machine — nothing is sent to external servers except when testing prompts against AI models.

## Key Features

- **Local-only data storage** — All projects, prompts, and versions are stored in IndexedDB via Dexie.js
- **Project / Prompt / Version organization** — Hierarchical structure to manage prompt libraries
- **Zod schema editor** — Monaco-powered editor for defining structured output schemas
- **Real-time example validation** — Validate example outputs against your Zod schemas instantly
- **Multi-model testing** — Test prompts against Gemini 2.5 Flash and GPT-4o Mini
- **XML prompt format generation** — Generates prompts in XML format for consistent AI parsing
- **Version forking** — Fork any version to iterate on prompts without losing history

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+) or [Bun](https://bun.sh/)
- An API key for at least one supported model (OpenAI or Google Gemini)

### Installation

```bash
git clone <repo-url>
cd promptsmith
bun install    # or: npm install
```

### Development

```bash
bun dev        # or: npm run dev
```

The app runs at `http://localhost:3000` by default.

### Other Commands

| Command | Description |
|---------|-------------|
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun run typecheck` | Run TypeScript type checking |
| `bun run check` | Lint and format with Biome |
| `bun run test:e2e` | Run Playwright end-to-end tests |

## Architecture

```
src/
├── app/                 # Next.js App Router pages
│   └── [projectSlug]/   # Dynamic routes: project → prompt → version
├── components/          # React components
│   ├── editor/          # Prompt editing UI (role, instructions, schema, examples)
│   ├── projects/        # Project CRUD
│   ├── prompts/         # Prompt CRUD
│   ├── versions/        # Version management
│   ├── settings/        # API key configuration
│   ├── layout/          # Header and layout
│   └── ui/              # shadcn/ui primitives
├── db/                  # Dexie.js database layer
│   ├── index.ts         # Schema definitions and db instance
│   └── hooks/           # React hooks for each entity (projects, prompts, versions, results, settings)
└── lib/                 # Shared utilities
    ├── ai/              # Vercel AI SDK integration (model registry, generate)
    ├── prompt-generator.ts  # XML prompt assembly
    ├── zod-validator.ts     # Runtime Zod schema parsing and validation
    └── utils.ts             # Class-name merging and slug generation
```

### Data Model

Projects contain Prompts, which contain Versions. Each Version holds a Zod schema, examples, instructions, and an agent role. Results are produced by running a Version against a model.

### Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Dexie.js (IndexedDB wrapper)
- **UI Components**: shadcn/ui + Radix UI
- **Code Editor**: Monaco Editor
- **AI Integration**: Vercel AI SDK
- **Linting / Formatting**: Biome
- **E2E Testing**: Playwright
