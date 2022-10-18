import ora from 'ora';
import { execa } from 'execa';
import { logger } from '../util/logger.js';

export async function initGit(projectDir: string) {
  const spinner = ora('Initializing git...').start();

  try {
    await execa('git', ['init'], { cwd: projectDir });
  } catch (e) {
    logger.error(e);
    return spinner.fail('Failed to initialize git. Please make sure you have git installed.\n');
  }
  return spinner.succeed('Successfully initializes a git repository!\n');
}
