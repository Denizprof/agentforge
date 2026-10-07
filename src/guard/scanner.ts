import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

export interface RiskFinding {
  file: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
}

interface Rule {
  severity: RiskFinding['severity'];
  pattern: RegExp;
  message: string;
}

const RULES: Rule[] = [
  {
    severity: 'HIGH',
    pattern: /~\/\.ssh|\bid_rsa\b|\bid_ed25519\b/,
    message: 'Credential access: references SSH keys',
  },
  {
    severity: 'HIGH',
    pattern: /\bAWS_ACCESS_KEY_ID\b|\bAWS_SECRET_ACCESS_KEY\b/,
    message: 'Credential access: references AWS credentials',
  },
  {
    severity: 'HIGH',
    pattern: /\bNPM_TOKEN\b/,
    message: 'Credential access: references NPM_TOKEN',
  },
  {
    severity: 'HIGH',
    pattern: /\brm\s+(-[a-zA-Z]*\s+)*-[a-zA-Z]*[rR][a-zA-Z]*\s+(-[a-zA-Z]+\s+)*(\/|~|\$HOME)(\s|\/?\*|$)/,
    message: 'Destructive command: recursive delete of root or home directory',
  },
  {
    severity: 'HIGH',
    pattern: /\bmkfs(\.\w+)?\b/,
    message: 'Destructive command: filesystem formatting (mkfs)',
  },
  {
    severity: 'MEDIUM',
    pattern: /\b(curl|wget)\b[^\n|]*\|\s*(sudo\s+)?(ba|z|da)?sh\b/,
    message: 'Blind remote execution: piping a download into a shell',
  },
];

async function collectSkillFiles(dir: string): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectSkillFiles(full)));
    } else if (/\.(md|sh)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

export async function scanProject(cwd: string): Promise<RiskFinding[]> {
  const targets = [
    path.join(cwd, 'CLAUDE.md'),
    path.join(cwd, 'AGENTS.md'),
    path.join(cwd, 'CODEX.md'),
    ...(await collectSkillFiles(path.join(cwd, 'skills'))),
    ...(await collectSkillFiles(path.join(cwd, '.agentforge', 'skills'))),
  ];

  const findings: RiskFinding[] = [];
  for (const target of targets) {
    let content: string;
    try {
      content = await readFile(target, 'utf8');
    } catch {
      continue; // target file doesn't exist
    }

    const file = path.relative(cwd, target).split(path.sep).join('/');
    const lines = content.split(/\r?\n/);
    for (const rule of RULES) {
      lines.forEach((line, i) => {
        if (rule.pattern.test(line)) {
          findings.push({ file, severity: rule.severity, message: `${rule.message} (line ${i + 1})` });
        }
      });
    }
  }
  return findings;
}
