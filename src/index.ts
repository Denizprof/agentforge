import { Command } from 'commander';
import * as p from '@clack/prompts';
import chalk from 'chalk';
import fs from 'node:fs/promises';
import path from 'node:path';
import { analyzeProject } from './core/analyzer';
import { generateAgentsMD } from './core/generator';
import { generateClaudeConfig } from './adapters/claude';
import { generateCodexConfig } from './adapters/codex';
import { scanProject } from './guard/scanner';
import { calculateScore } from './bench/scorer.js';
import { generateGitHubAction } from './engine/ci-generator.js';
import { createSkill, SECURITY_REVIEW_SKILL } from './engine/skills.js';
import { generateIgnoreRules, generateOptimizationInstructions } from './optimizer/token-reducer';

const program = new Command();

program
  .name('agentforge')
  .description('CLI toolkit and operating layer for AI coding agents')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize AgentForge in the current project')
  .action(async () => {
    p.intro(chalk.bgCyan.black(' AgentForge - Supercharging AI Agents '));

    const cwd = process.cwd();
    const s = p.spinner();
    s.start('Analyzing project architecture and token optimization rules...');
    const ctx = await analyzeProject(cwd);
    s.stop('Analysis complete');

    const framework = ctx.framework ? ` (${ctx.framework})` : '';
    const manager = ctx.packageManager ? ` via ${ctx.packageManager}` : '';
    p.log.info(`Detected: ${ctx.language}${framework}${manager}`);

    await fs.writeFile(path.join(cwd, '.agentignore'), generateIgnoreRules(), 'utf8');

    const tokenRules = generateOptimizationInstructions();
    await fs.writeFile(path.join(cwd, 'AGENTS.md'), generateAgentsMD(ctx), 'utf8');
    await fs.writeFile(path.join(cwd, 'CLAUDE.md'), generateClaudeConfig(ctx, tokenRules), 'utf8');
    await fs.writeFile(path.join(cwd, 'CODEX.md'), generateCodexConfig(ctx, tokenRules), 'utf8');

    // Never clobber a security-review skill the user has already customised.
    const createdSkill = await createSkill(cwd, 'security-review', SECURITY_REVIEW_SKILL);

    p.note(
      [
        `${chalk.green('✔')} .agentignore`,
        `${chalk.green('✔')} AGENTS.md`,
        `${chalk.green('✔')} CLAUDE.md`,
        `${chalk.green('✔')} CODEX.md`,
        `${chalk.green('✔')} .agentforge/skills/security-review.md${createdSkill ? '' : chalk.dim(' (kept existing)')}`,
      ].join('\n'),
      'Files created',
    );

    const { total } = await calculateScore(cwd);
    p.outro(
      chalk.green(
        `AgentForge initialization complete. Your agent is now context-aware and optimized. Current Agent Readiness Score: ${total}/100`,
      ),
    );
  });

program
  .command('scan')
  .description('Scan agent configs and skills for security risks')
  .action(async () => {
    p.intro(chalk.bgCyan.black(' AgentGuard '));

    const s = p.spinner();
    s.start('AgentGuard: Scanning project for AI security risks...');
    const findings = await scanProject(process.cwd());
    s.stop('Scan complete');

    if (findings.length === 0) {
      p.outro(chalk.green('AgentGuard: 0 risks found. Your agent environment is secure.'));
      return;
    }

    for (const f of findings) {
      if (f.severity === 'HIGH') {
        p.log.error(chalk.red(`[HIGH] ${f.file}: ${f.message}`));
      } else if (f.severity === 'MEDIUM') {
        p.log.warn(chalk.yellow(`[MEDIUM] ${f.file}: ${f.message}`));
      } else {
        p.log.info(`[LOW] ${f.file}: ${f.message}`);
      }
    }

    const high = findings.filter((f) => f.severity === 'HIGH').length;
    p.outro(chalk.red(`AgentGuard: ${findings.length} risks found (${high} high severity).`));
    process.exitCode = 1;
  });

program
  .command('score')
  .description('Calculate the Agent Readiness Score (0-100)')
  .action(async () => {
    p.intro(chalk.bgCyan.black(' AgentBench '));

    const s = p.spinner();
    s.start('AgentBench: Calculating AI readiness score...');
    const { total, breakdown } = await calculateScore(process.cwd());
    s.stop('Score calculated');

    const width = Math.max(...breakdown.map((b) => b.category.length));
    const lines = breakdown.map((b) => {
      const color = b.points >= b.max ? chalk.green : b.points > 0 ? chalk.yellow : chalk.red;
      const sign = b.points < 0 ? '-' : '+';
      const pts = `${sign}${Math.abs(b.points)}`.padStart(3);
      const max = String(b.max).padStart(2);
      return `${color(b.points >= b.max ? '✔' : '✖')} ${b.category.padEnd(width)}  ${color(pts)} ${chalk.dim(`/ ${max}`)}  ${chalk.dim(b.message)}`;
    });
    p.note(lines.join('\n'), 'Score breakdown');

    const color = total >= 85 ? chalk.green : total >= 50 ? chalk.yellow : chalk.red;
    p.outro(`Agent Readiness Score: ${chalk.bold(color(`${total}/100`))}`);
  });

program
  .command('add-skill <name>')
  .description('Scaffold a new agent skill in .agentforge/skills')
  .action(async (name: string) => {
    p.intro(chalk.bgCyan.black(' AgentForge '));

    const s = p.spinner();
    s.start(`AgentForge: Scaffolding skill '${name}'...`);
    try {
      const created = await createSkill(process.cwd(), name);
      if (!created) {
        s.stop('Skill already exists');
        p.outro(chalk.yellow(`Skill '${name}' already exists at .agentforge/skills/${name}.md. Nothing was changed.`));
        process.exitCode = 1;
        return;
      }
    } catch (err) {
      s.stop('Failed');
      p.outro(chalk.red((err as Error).message));
      process.exitCode = 1;
      return;
    }
    s.stop('Skill scaffolded');

    p.outro(
      chalk.green(
        `Skill '${name}' created at .agentforge/skills/${name}.md. Don't forget to update your CLAUDE.md to instruct the agent to use this skill.`,
      ),
    );
  });

program
  .command('init-ci')
  .description('Generate a GitHub Actions workflow that runs AgentGuard on pull requests')
  .action(async () => {
    p.intro(chalk.bgCyan.black(' AgentForge '));

    const s = p.spinner();
    s.start('AgentForge: Generating GitHub CI/CD workflow...');
    const created = await generateGitHubAction(process.cwd());
    if (!created) {
      s.stop('Workflow already exists');
      p.outro(chalk.yellow('.github/workflows/agentforge-ci.yml already exists. Nothing was changed.'));
      process.exitCode = 1;
      return;
    }
    s.stop('Workflow generated');

    p.outro(
      chalk.green(
        'GitHub Action created at .github/workflows/agentforge-ci.yml. Your PRs are now protected by AgentGuard!',
      ),
    );
  });

program.parseAsync(process.argv);
