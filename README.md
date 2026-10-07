<div align="center">

# AgentForge

**The open-source infrastructure and operating layer for AI coding agents.**

Context standardization. Token efficiency. Security validation. Engineered for production environments.

`npx -y @denizprof/agentforge init`

</div>

---

## The Problem

AI coding agents (such as Claude Code and Codex) possess substantial reasoning capabilities, but out of the box, they lack environmental constraints:

- **Contextual Blindness:** Agents begin sessions cold. They guess your technology stack, architectural patterns, and package managers—often incorrectly.
- **Token Inefficiency:** Unrestricted agents process irrelevant directories (`node_modules`, build outputs, lockfiles) and rewrite entire files for single-line modifications, resulting in wasted tokens and latency.
- **Security Vulnerabilities:** Agent instructions and skill scripts execute autonomously. Unreviewed configurations containing destructive commands (e.g., `rm -rf /`) or unauthorized credential access pose critical risks to local machines and CI/CD pipelines.

## The AgentForge Methodology

AgentForge does not just configure your agent; it disciplines it. By initializing AgentForge, you enforce a strict, senior-level engineering methodology on your AI agents:

1. **Contextualize:** Before proposing any changes, the agent is forced to read the generated `AGENTS.md` and consult the `.agentforge/skills/` directory to understand the project's boundaries.
2. **Analyze & Plan:** The injected rules strictly prohibit blind coding. The agent must articulate its understanding of the architecture and output a step-by-step implementation plan first.
3. **Execute Surgically:** Guided by `CLAUDE.md`/`CODEX.md` and aggressive `.agentignore` rules, the agent makes targeted, token-efficient line replacements rather than full-file rewrites.
4. **Validate & Review:** The agent is restricted from making destructive system calls. It is instructed to cross-reference its work against the provided `security-review` playbook to ensure no credentials or dangerous patterns are introduced.

## Architecture & Solution

AgentForge standardizes the interface between your repository and AI agents, ensuring deterministic operations:

| Challenge | AgentForge Implementation |
|---|---|
| Contextual ambiguity | Analyzes the repository stack, generating tailored `AGENTS.md`, `CLAUDE.md`, and `CODEX.md` configurations. |
| Token waste | Generates an aggressive `.agentignore` file alongside strict token-optimization directives. |
| Security vulnerabilities | **AgentGuard** performs static analysis on configurations to prevent credential exposure and destructive operations. |
| Readiness assessment | **AgentBench** evaluates the repository and assigns a standardized readiness metric (0–100). |
| Unstructured execution | A **Skills Engine** provides structured, auditable execution protocols for complex tasks. |

## Quick Start

Execute the following command at the root of your project:

```bash
npx -y @denizprof/agentforge init
```

**Expected Output:**

```text
AgentForge Initialization

[✓] Analysis complete
[i] Detected: TypeScript (Next.js) via pnpm

Files generated:
  - .agentignore
  - AGENTS.md
  - CLAUDE.md
  - CODEX.md
  - .agentforge/skills/security-review.md

AgentForge initialization complete.
Current Agent Readiness Score: 100/100
```

> **Note:** The `init` command overwrites existing `.agentignore`, `AGENTS.md`, `CLAUDE.md`, and `CODEX.md` files to ensure they are up to date. It does not overwrite user-authored skill definitions.

## Command Reference

| Command | Description |
|---|---|
| `agentforge init` | Analyzes the project and generates foundational agent configuration files. |
| `agentforge scan` | Executes AgentGuard static analysis. Exits with code 1 if risks are detected. |
| `agentforge score` | Calculates and displays the Agent Readiness Score. |
| `agentforge add-skill <name>` | Scaffolds a new skill definition within `.agentforge/skills/`. |
| `agentforge init-ci` | Generates a GitHub Actions workflow for automated AgentGuard validation. |

## Core Components

### Agent Intelligence

AgentForge inspects the project environment to generate explicit instructions tailored to the repository's architecture. It natively supports TypeScript/JavaScript, Python, Rust, and Go, accurately mapping package managers and frameworks (e.g., Next.js, React, Express) into the universal `AGENTS.md` and agent-specific files.

### Token Optimizer

Reduces context window overhead by generating a comprehensive `.agentignore` file targeting standard build and dependency directories (`node_modules`, `dist`, `.git`, `coverage`, `venv`, lockfiles). It additionally injects strict behavioral constraints preventing verbose outputs.

### AgentGuard Static Analysis

AgentGuard performs line-based static analysis across `CLAUDE.md`, `AGENTS.md`, `CODEX.md`, and all markdown/shell files within skill directories.

| Severity | Detection Target |
|---|---|
| HIGH | Credential access (e.g., `~/.ssh`, `id_rsa`, `AWS_ACCESS_KEY_ID`). |
| HIGH | Destructive commands (e.g., `rm -rf /`, `mkfs`). |
| MEDIUM | Blind remote execution patterns (e.g., `curl ... \| sh`, `wget ... \| bash`). |

> **Disclaimer:** AgentGuard utilizes pattern matching for static analysis. It is designed to catch overt risks and misconfigurations, not heavily obfuscated commands. It operates as a validation layer, not an isolated runtime sandbox.

### AgentBench Readiness Score

```bash
agentforge score
```

Calculates a repository readiness metric based on a 100-point scale. The presence of valid context files and token optimization rules increases the score, while security vulnerabilities identified by AgentGuard result in substantial penalties (-10 points per HIGH risk, -5 points per MEDIUM risk).

### Skills Engine

Provides structured, auditable markdown templates for complex agent tasks:

```bash
agentforge add-skill deploy
```

Skills are maintained within `.agentforge/skills/`, ensuring they are version-controlled alongside the codebase and subject to AgentGuard security scans.

## Continuous Integration

Enforce agent security protocols at the pull request level to prevent malicious prompts or destructive workflows from merging into your main branch:

```bash
agentforge init-ci
```

This generates a GitHub Actions workflow (`.github/workflows/agentforge-ci.yml`) that runs `npx -y @denizprof/agentforge scan` on every pull request. The workflow enforces a strict failure state (exit code 1) upon detecting any security risks.

## Development

```bash
npm install
npm run dev -- init     # Execute from source
npm run typecheck       # Run TypeScript compiler checks
npm run build           # Bundle output to dist/
```

## License

MIT
