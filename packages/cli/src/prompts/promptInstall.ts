import inquirer from 'inquirer';
import { logger } from '../util/logger.js';
import { promptPkgManager } from './promptPkgManager.js';

/**
 * Asks the user whether we should install packages.
 */
export async function promptInstall() {
  const pkgManager = await promptPkgManager();

  const { install } = await inquirer.prompt<{ install: boolean; }>({
    name: 'install',
    type: 'confirm',
    message: `Woudld you like to run '${pkgManager} install'?`,
    default: true,
  });

  if (install) {
    logger.success("Alright. We'll install the dependencies for you!");
  } else {
    logger.info(`No worries. You can run '${pkgManager} install' later to install the dependencies.`);
  }

  return { install, pkgManager };
}
