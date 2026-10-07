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
