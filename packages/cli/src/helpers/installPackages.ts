import { execa } from 'execa';
import ora from 'ora';
import { PackageManager } from '../util/getPkgManager.js';
import { logger } from '../util/logger.js';

/**
 * Installs the packages based on the package.json in the project.
 */
export async function installPackages(pkgManager: PackageManager, projectDir: string) {
  const spinner = ora('Installing packages...').start();

  try {
    await execa(pkgManager, ['install'], { cwd: projectDir });
  } catch (e) {
    logger.error(e);
    return spinner.fail('Failed to install packages.\n');
  }
  return spinner.succeed('Successfully installed packages!\n');
}
