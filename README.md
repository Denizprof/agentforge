<div align="center">

# 🔨 AgentForge

**The open-source infrastructure and operating layer for AI coding agents.**

Context. Token efficiency. Security. Measured — in one command.

`npx -y @denizprof/agentforge init`

</div>

---

## 😤 The Problem

AI coding agents like Claude Code and Codex are powerful, but out of the box they are running blind:

- **They lack context.** Every session starts cold. The agent guesses your stack, your package manager and your conventions — and guesses wrong.
- **They waste tokens.** Agents happily read `node_modules`, lockfiles, minified bundles and build output, then rewrite a whole file to change one line. You pay for every token.
- **They pose security risks.** Agent instructions and skill scripts are code the agent will *follow*. One careless `rm -rf /`, a `curl | sh`, or a reference to `~/.ssh` in a skill file is an incident waiting to happen — and nobody reviews markdown the way they review code.

## ✨ The Solution

AgentForge standardizes how agents see your project:

| Problem | AgentForge |
|---|---|
| Agents guess your stack | Detects language, framework and package manager, then writes `AGENTS.md`, `CLAUDE.md` and `CODEX.md` |
| Agents burn tokens | Generates an aggressive `.agentignore` and strict token-optimization rules |
| Agent configs go unreviewed | **AgentGuard** statically scans them for credential access, destructive commands and blind remote execution |
| "Is my repo agent-ready?" | **AgentBench** gives you a 0–100 readiness score |
| Agents improvise workflows | A **Skills Engine** gives them structured, reviewable playbooks |

## 🚀 Quick Start

```bash
npx -y @denizprof/agentforge init
```

```text
┌   AgentForge - Supercharging AI Agents
│
◇  Analysis complete
│
●  Detected: TypeScript (Next.js) via pnpm
│
◇  Files created ──────────────────────────╮
│                                           │
│  ✔ .agentignore                           │
│  ✔ AGENTS.md                              │
│  ✔ CLAUDE.md                              │
│  ✔ CODEX.md                               │
│  ✔ .agentforge/skills/security-review.md  │
│                                           │
├───────────────────────────────────────────╯
│
└  AgentForge initialization complete. Your agent is now context-aware and optimized.
   Current Agent Readiness Score: 100/100
```

> `init` overwrites `.agentignore`, `AGENTS.md`, `CLAUDE.md` and `CODEX.md`. It never overwrites an existing skill.

### Commands

| Command | What it does |
|---|---|
| `agentforge init` | Detect the project and generate all agent config files |
| `agentforge scan` | Run AgentGuard; exits `1` if any risk is found |
| `agentforge score` | Calculate the Agent Readiness Score |
| `agentforge add-skill <name>` | Scaffold a new skill in `.agentforge/skills/` |
| `agentforge init-ci` | Generate a GitHub Actions workflow for AgentGuard |

## 🧰 Core Features

### 🧠 Agent Intelligence

AgentForge inspects your project and writes agent instructions tailored to it:

- **Languages:** TypeScript/JavaScript, Python, Rust, Go
- **Package managers:** npm, yarn, pnpm, bun (plus cargo and go modules)
- **Frameworks:** Next.js, React, Vue, Express

Generated files: `AGENTS.md` (universal rules for any agent), `CLAUDE.md` and `CODEX.md` (agent-specific rules).

### ⚡ Token Optimizer

An ultra-aggressive `.agentignore` keeps junk out of the context window — `node_modules`, `dist`, `build`, `.git`, `.next`, `coverage`, `venv`, `__pycache__`, `*.min.js`, `*.map` and lockfiles — plus strict rules injected into each agent's config:

```text
TOKEN OPTIMIZATION RULES:
1. NEVER output full files for 1-line changes. Use surgical line replacements.
2. DO NOT read minified or build files.
3. Keep explanations strictly under 2 sentences unless asked.
```

### 🛡️ AgentGuard Security Scanner

Static analysis of `CLAUDE.md`, `AGENTS.md`, `CODEX.md` and every `.md`/`.sh` file in `skills/` and `.agentforge/skills/`.

| Severity | Detects |
|---|---|
| 🔴 HIGH | Credential access (`~/.ssh`, `id_rsa`, `AWS_ACCESS_KEY_ID`, `NPM_TOKEN`) |
| 🔴 HIGH | Destructive commands (`rm -rf /`, `mkfs`) |
| 🟡 MEDIUM | Blind remote execution (`curl … \| sh`, `wget … \| bash`) |

```text
┌   AgentGuard
◇  Scan complete
■  [HIGH] skills/evil.sh: Credential access: references SSH keys (line 1)
■  [HIGH] skills/evil.sh: Destructive command: recursive delete of root or home directory (line 2)
▲  [MEDIUM] skills/evil.sh: Blind remote execution: piping a download into a shell (line 4)
└  AgentGuard: 3 risks found (2 high severity).
```

> Detection is line-based pattern matching. It catches the obvious and the careless, not obfuscated or multi-line commands. Treat it as a tripwire, not a sandbox.

### 📊 AgentBench Readiness Score

```bash
agentforge score
```

```text
◇  Score breakdown ────────────────────────────────────╮
│                                                      │
│  ✔ Base                +30 / 30  Baseline score      │
│  ✔ Context             +20 / 20  AGENTS.md found     │
│  ✔ Context             +20 / 20  CLAUDE.md found     │
│  ✔ Token Optimization  +15 / 15  .agentignore found  │
│  ✔ Security            +15 / 15  0 risks found       │
│                                                      │
├──────────────────────────────────────────────────────╯
└  Agent Readiness Score: 100/100
```

Security findings subtract points (−10 per HIGH, −5 per MEDIUM), so a risky config scores visibly worse. The final score is clamped to 0–100: 🟢 ≥ 85, 🟡 ≥ 50, 🔴 below.

### 🧩 Skills Engine

Skills are structured, reviewable markdown playbooks your agent follows for complex tasks:

```bash
agentforge add-skill deploy
```

```markdown
# Skill: deploy

## Description
## Instructions
## Allowed Commands
## Forbidden Actions
```

Skills live in `.agentforge/skills/`, are version-controlled with your code, and are scanned by AgentGuard. `init` ships a read-only `security-review` skill from day one, and the generated `CLAUDE.md` and `CODEX.md` tell the agent to use them.

## 🔁 CI/CD Integration

Protect every pull request:

```bash
agentforge init-ci
```

This writes `.github/workflows/agentforge-ci.yml`, which checks out your code, sets up Node.js and runs `npx -y @denizprof/agentforge scan` on every `pull_request`. Because `scan` exits with code `1` when it finds a risk, the job fails — mark it as a **required check** in your branch protection rules and a dangerous agent config can't be merged.

## 🛠️ Development

```bash
npm install
npm run dev -- init     # run from source
npm run typecheck
npm run build           # bundle to dist/
```

## 📄 License

MIT
