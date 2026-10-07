import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

export interface ProjectContext {
  language: string;
  packageManager: string | null;
  framework: string | null;
}

const LOCKFILES: Array<[file: string, manager: string]> = [
  ['package-lock.json', 'npm'],
  ['yarn.lock', 'yarn'],
  ['pnpm-lock.yaml', 'pnpm'],
  ['bun.lockb', 'bun'],
];

// Order matters: meta-frameworks first so "next" wins over "react".
const FRAMEWORKS: Array<[dep: string, label: string]> = [
  ['next', 'Next.js'],
  ['vue', 'Vue'],
  ['react', 'React'],
  ['express', 'Express'],
];

async function exists(file: string): Promise<boolean> {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function analyzeNode(cwd: string): Promise<ProjectContext> {
  let packageManager: string | null = null;
  for (const [file, manager] of LOCKFILES) {
    if (await exists(path.join(cwd, file))) {
      packageManager = manager;
      break;
    }
  }

  let deps: Record<string, unknown> = {};
  try {
    const pkg = JSON.parse(await readFile(path.join(cwd, 'package.json'), 'utf8'));
    deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
  } catch {
    // Unreadable or malformed package.json: fall back to defaults.
  }

  const framework = FRAMEWORKS.find(([dep]) => dep in deps)?.[1] ?? null;
  const isTs = 'typescript' in deps || (await exists(path.join(cwd, 'tsconfig.json')));

  return { language: isTs ? 'TypeScript' : 'JavaScript', packageManager, framework };
}

export async function analyzeProject(cwd: string): Promise<ProjectContext> {
  if (await exists(path.join(cwd, 'package.json'))) return analyzeNode(cwd);

  if (
    (await exists(path.join(cwd, 'requirements.txt'))) ||
    (await exists(path.join(cwd, 'pyproject.toml')))
  ) {
    return { language: 'Python', packageManager: null, framework: null };
  }
  if (await exists(path.join(cwd, 'Cargo.toml'))) {
    return { language: 'Rust', packageManager: 'cargo', framework: null };
  }
  if (await exists(path.join(cwd, 'go.mod'))) {
    return { language: 'Go', packageManager: 'go modules', framework: null };
  }

  return { language: 'Unknown', packageManager: null, framework: null };
}
