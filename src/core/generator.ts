import type { ProjectContext } from './analyzer';

export function describeStack(context: ProjectContext): string {
  const framework = context.framework ? ` with ${context.framework}` : '';
  const manager = context.packageManager ? ` (managed by ${context.packageManager})` : '';
  return `This project uses ${context.language}${framework}${manager}.`;
}

export function generateAgentsMD(context: ProjectContext): string {
  return [
    '# AGENTS.md',
    '',
    '## Project Overview',
    '',
    describeStack(context),
    '',
    '## Universal Rules',
    '',
    'Agents must strictly follow the workflow defined in the project. Do not guess architectural patterns; read the existing codebase first.',
    '',
  ].join('\n');
}
