import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const SKILLS_DIR = path.join('.agentforge', 'skills');

const VALID_NAME = /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/;

export function skillTemplate(skillName: string): string {
  return [
    `# Skill: ${skillName}`,
    '',
    '## Description',
    '[Add description of what this skill does]',
    '',
    '## Instructions',
    '1. [Step 1]',
    '2. [Step 2]',
    '',
    '## Allowed Commands',
    '- [e.g., npm run test]',
    '',
    '## Forbidden Actions',
    '- [e.g., Do not modify configuration files]',
    '',
  ].join('\n');
}

export const SECURITY_REVIEW_SKILL = [
  '# Skill: security-review',
  '',
  '## Description',
  'Review pending changes for security problems before they are committed.',
  '',
  '## Instructions',
  '1. List the files changed (`git diff --name-only`) and read each diff.',
  '2. Check for hardcoded secrets, tokens, or credentials.',
  '3. Check for unvalidated user input reaching shells, queries, or file paths.',
  '4. Check for newly added dependencies and note why each is needed.',
  '5. Report findings by severity (HIGH / MEDIUM / LOW) with file and line.',
  '',
  '## Allowed Commands',
  '- git diff',
  '- git status',
  '- npx -y @denizprof/agentforge scan',
  '',
  '## Forbidden Actions',
  '- Do not modify files; this skill is read-only.',
  '- Do not read credential files or environment secrets.',
  '- Do not run network commands.',
  '',
].join('\n');

/**
 * Creates `.agentforge/skills/<skillName>.md`. Never overwrites an existing
 * skill: resolves `false` if the file already exists, `true` if created.
 */
export async function createSkill(
  cwd: string,
  skillName: string,
  content: string = skillTemplate(skillName),
): Promise<boolean> {
  if (!VALID_NAME.test(skillName)) {
    throw new Error(
      `Invalid skill name '${skillName}': use letters, numbers, '-' or '_' (no paths or spaces).`,
    );
  }

  const dir = path.join(cwd, SKILLS_DIR);
  await mkdir(dir, { recursive: true });

  try {
    await writeFile(path.join(dir, `${skillName}.md`), content, { encoding: 'utf8', flag: 'wx' });
    return true;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'EEXIST') return false;
    throw err;
  }
}
