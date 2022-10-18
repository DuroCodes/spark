import inquirer from 'inquirer';
import { getPkgManager } from '../util/getPkgManager.js';
import { CliResults } from '../util/types.js';

/**
 * Asks the user to choose which package manager to choose out of ones they have installed.
 */
export async function promptPkgManager() {
  const pkgManagers = await getPkgManager();

  if (typeof pkgManagers === 'string') return pkgManagers;

  const { pkgManager } = await inquirer.prompt<Pick<CliResults, 'pkgManager'>>({
    type: 'list',
    name: 'pkgManager',
    message: 'Which package manager would you like to choose?',
    default: 'npm',
    choices: pkgManagers,
  });

  return pkgManager;
}
