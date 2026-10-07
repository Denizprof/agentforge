Ekteki görselde projenin son yayın öncesi adımlarının başarıyla tamamlandığı görülüyor. Yapılan güncellemeler arasında `tsup.config.ts` üzerinden sourcemap özelliğinin kapatılarak paket boyutunun 14.8 kB'den 9.3 kB'ye düşürülmesi, Daniel Deniz Akıncı adına MIT `LICENSE` dosyasının oluşturulması ve paket isminin `@denizprof/agentforge` olarak ayarlanması yer alıyor. Ayrıca sistem, npm üzerinde yayınlama işleminin sorunsuz çalışabilmesi için `publishConfig` ayarını otomatik olarak eklemiş ve `package.json` dosyasındaki hatalı BOM karakterini temizlemiş.

Projenizi daha profesyonel ve ciddi bir yapıya kavuşturmak için README dosyanızı tüm emojilerden, aşırı samimi dilden ve günlük ifadelerden arındırarak kurumsal bir "Açık Kaynak Altyapı Aracı" formatında yeniden yazdım:

```markdown
<div align="center">

# AgentForge

**The open-source infrastructure and operating layer for AI coding agents.**

Context standardization. Token efficiency. Security validation.

`npx -y @denizprof/agentforge init`

</div>

---

## Problem Statement

AI coding agents, such as Claude Code and Codex, offer substantial capabilities but operate inefficiently without proper environmental constraints:

- **Lack of Contextual Awareness:** Agents often begin sessions without structural context, leading to incorrect assumptions regarding technology stacks, package managers, and architectural conventions.
- **Token Inefficiency:** Unrestricted agents frequently process irrelevant directories (e.g., `node_modules`, build outputs, lockfiles), resulting in excessive token consumption for minor code modifications.
- **Security Vulnerabilities:** Agent instructions and skill scripts dictate automated behavior. Unreviewed configurations containing destructive commands (e.g., `rm -rf /`) or unauthorized credential access pose significant security risks to the local environment.

## Architecture & Solution

AgentForge standardizes the interface between your repository and AI agents, ensuring deterministic and secure operations:

| Challenge | AgentForge Implementation |
|---|---|
| Contextual ambiguity | Analyzes the repository to detect the language, framework, and package manager, generating tailored `AGENTS.md`, `CLAUDE.md`, and `CODEX.md` configurations. |
| Token waste | Generates an aggressive `.agentignore` file alongside strict token-optimization directives. |
| Security vulnerabilities | **AgentGuard** performs static analysis on configurations to prevent credential exposure and destructive operations. |
| Readiness assessment | **AgentBench** evaluates the repository and assigns a standardized readiness metric (0–100). |
| Unstructured execution | A **Skills Engine** provides structured, auditable execution protocols. |

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

> Note: The `init` command overwrites existing `.agentignore`, `AGENTS.md`, `CLAUDE.md`, and `CODEX.md` files. It does not overwrite existing skill definitions.

### Command Reference

| Command | Description |
| --- | --- |
| `agentforge init` | Analyzes the project and generates foundational agent configuration files. |
| `agentforge scan` | Executes AgentGuard static analysis. Exits with code `1` if risks are detected. |
| `agentforge score` | Calculates and displays the Agent Readiness Score. |
| `agentforge add-skill <name>` | Scaffolds a new skill definition within `.agentforge/skills/`. |
| `agentforge init-ci` | Generates a GitHub Actions workflow for automated AgentGuard validation. |

## Core Components

### Agent Intelligence

AgentForge inspects the project environment to generate specific instructions tailored to the repository's architecture:

* **Supported Languages:** TypeScript/JavaScript, Python, Rust, Go
* **Package Managers:** npm, yarn, pnpm, bun, cargo, go modules
* **Frameworks:** Next.js, React, Vue, Express

Generated configurations include `AGENTS.md` (universal parameters) alongside agent-specific files (`CLAUDE.md`, `CODEX.md`).

### Token Optimizer

Reduces context window waste by generating a comprehensive `.agentignore` file targeting standard build and dependency directories (`node_modules`, `dist`, `.git`, `coverage`, `venv`, lockfiles). It additionally injects strict behavioral constraints into the agent configurations to prevent full-file rewrites for minor modifications.

### AgentGuard Static Analysis

AgentGuard performs line-based static analysis across `CLAUDE.md`, `AGENTS.md`, `CODEX.md`, and all executable/markdown files within skill directories.

| Severity | Detection Target |
| --- | --- |
| HIGH | Credential access (e.g., `~/.ssh`, `id_rsa`, `AWS_ACCESS_KEY_ID`). |
| HIGH | Destructive commands (e.g., `rm -rf /`, `mkfs`). |
| MEDIUM | Blind remote execution patterns (e.g., `curl ... |

*Disclaimer: AgentGuard utilizes pattern matching for static analysis. It is designed to catch overt risks and misconfigurations, not heavily obfuscated commands. It operates as a validation layer, not an isolated sandbox.*

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

Enforce agent security protocols at the pull request level:

```bash
agentforge init-ci

```

This generates a GitHub Actions workflow (`.github/workflows/agentforge-ci.yml`) that runs `npx -y @denizprof/agentforge scan` on every pull request. The workflow enforces a strict failure state (exit code `1`) upon detecting any security risks, preventing the integration of dangerous agent configurations.

## Development

```bash
npm install
npm run dev -- init     # Execute from source
npm run typecheck       # Run TypeScript compiler checks
npm run build           # Bundle output to dist/

```

## License

MIT

```

```
