import type { ProjectContext } from '../core/analyzer';
import { describeStack } from '../core/generator';

export function generateClaudeConfig(context: ProjectContext, tokenInstructions: string): string {
  return [
    '# CLAUDE.md',
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
    'You have access to structured skills located in the `.agentforge/skills/` directory. Always check this directory for relevant `.md` files (like `security-review.md`) before executing complex tasks. Follow their instructions strictly.',
    '',
    '## Claude-Specific Instructions',
    '',
    '- Always verify logic before committing.',
    '- Prefer CLI tools over manual file edits where applicable.',
    '- Read the existing code before proposing changes; do not guess architectural patterns.',
    '',
  ].join('\n');
}
