import type { ProjectContext } from '../core/analyzer';
import { describeStack } from '../core/generator';

export function generateCodexConfig(context: ProjectContext, tokenInstructions: string): string {
  return [
    '# CODEX.md',
    '',
    '## Project Overview',
    '',
    describeStack(context),
    'See AGENTS.md for the universal rules that apply to all agents.',
    '',
    '## Token Optimization & Constraints',
    '',
    tokenInstructions.trim(),
    '',
    '## Available Skills',
    '',
    'Structured skills live in the `.agentforge/skills/` directory. Check it for a relevant `.md` file (like `security-review.md`) before starting a complex task, and follow its instructions strictly.',
    '',
    '## Codex Workflow Rules',
    '',
    '- Make small, reviewable changes; return a minimal diff or patch instead of rewriting whole files.',
    '- Read the surrounding code and match its existing patterns before generating new code.',
    '- When completing or suggesting code inline, match the file\'s existing style, naming and imports.',
    '- Run the project\'s own test and lint commands to verify a change before reporting it done.',
    '- Do not run commands that delete data, reach the network, or touch credentials unless explicitly asked.',
    '',
  ].join('\n');
}
