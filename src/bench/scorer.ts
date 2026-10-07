import { access } from 'node:fs/promises';
import path from 'node:path';
import { scanProject } from '../guard/scanner.js';

export interface ScoreBreakdownItem {
  category: string;
  points: number;
  max: number;
  message: string;
}

export interface ScoreResult {
  total: number;
  breakdown: ScoreBreakdownItem[];
}

const BASE_SCORE = 30;

async function exists(file: string): Promise<boolean> {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

export async function calculateScore(cwd: string): Promise<ScoreResult> {
  const breakdown: ScoreBreakdownItem[] = [
    { category: 'Base', points: BASE_SCORE, max: BASE_SCORE, message: 'Baseline score' },
  ];

  // Context (max 40): +20 per agent config file.
  for (const file of ['AGENTS.md', 'CLAUDE.md']) {
    const found = await exists(path.join(cwd, file));
    breakdown.push({
      category: 'Context',
      points: found ? 20 : 0,
      max: 20,
      message: found ? `${file} found` : `${file} missing - run "agentforge init"`,
    });
  }

  // Token optimization (max 15)
  const hasIgnore = await exists(path.join(cwd, '.agentignore'));
  breakdown.push({
    category: 'Token Optimization',
    points: hasIgnore ? 15 : 0,
    max: 15,
    message: hasIgnore ? '.agentignore found' : '.agentignore missing - run "agentforge init"',
  });

  // Security (max 15): full marks when clean, penalties per finding otherwise.
  const findings = await scanProject(cwd);
  const high = findings.filter((f) => f.severity === 'HIGH').length;
  const medium = findings.filter((f) => f.severity === 'MEDIUM').length;
  breakdown.push({
    category: 'Security',
    points: findings.length === 0 ? 15 : -(high * 10 + medium * 5),
    max: 15,
    message:
      findings.length === 0
        ? '0 risks found'
        : `${high} high, ${medium} medium risk(s) - run "agentforge scan"`,
  });

  const sum = breakdown.reduce((acc, item) => acc + item.points, 0);
  return { total: Math.min(100, Math.max(0, sum)), breakdown };
}
