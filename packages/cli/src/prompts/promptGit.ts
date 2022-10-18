import inquirer from 'inquirer';
import { logger } from '../util/logger.js';

/**
 * Asks the user if they would like to initialize a git repo
 */
export async function promptGit() {
  const { git } = await inquirer.prompt<{ git: boolean; }>({
    name: 'git',
    type: 'confirm',
    message: 'Initialize a new git repository?',
    default: true,
  });

  if (git) {
    logger.success('Initializing repository...');
  } else {
    logger.info("Sounds good! You can run 'git init' later.");
  }

  return git;
}
