import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';
import colors from 'ansi-colors';
import inquirer from 'inquirer';
import { CliResults } from '../util/types.js';
import { PKG_ROOT } from '../util/consts.js';
import { logger } from '../util/logger.js';
import { promptOverwriteDir } from '../prompts/promptOverwriteDir.js';
import { installPackages } from './installPackages.js';
import { initGit } from './initGit.js';

export async function scaffoldProject({
  appName,
  pkgManager,
  language,
  flags: {
    noInstall,
    noGit,
  },
}: CliResults) {
  const projectDir = path.resolve(process.cwd(), appName);
  const srcDir = path.join(PKG_ROOT, 'templates', language);

  if (!noInstall) {
    logger.info(`\nUsing ${pkgManager}\n`);
  } else {
    logger.info('');
  }

  const spinner = ora(`Saffolding in ${projectDir}...\n`).start();

  if (fs.existsSync(projectDir)) {
    if (fs.readdirSync(projectDir).length === 0) {
      spinner.info(`${colors.cyan.bold(appName)} exists but is empty, continuing...\n`);
    } else {
      spinner.stopAndPersist();
      const overwriteDir = await promptOverwriteDir(appName);

      if (overwriteDir === 'abort') {
        spinner.fail('Aborting installation...');
        process.exit(0);
      }

      const overwriteAction = overwriteDir === 'clear'
        ? 'clear the directory'
        : 'overwrite conflicting files';

      const { confirmOverwriteDir } = await inquirer.prompt<{ confirmOverwriteDir: boolean; }>({
        name: 'confirmOverwriteDir',
        type: 'confirm',
        message: `Are you sure you want to ${overwriteAction}?`,
        default: false,
      });

      if (!confirmOverwriteDir) {
        spinner.fail('Aborting installation...');
        process.exit(0);
      }

      if (overwriteDir === 'clear') {
        spinner.info(`Emptying ${colors.cyan.bold(appName)} and creating spark app...\n`);
        fs.emptyDirSync(projectDir);
      }
    }
  }

  spinner.start();

  fs.copySync(srcDir, projectDir);

  fs.renameSync(
    path.join(projectDir, '_gitignore'),
    path.join(projectDir, '.gitignore'),
  );

  const scaffoldedName = appName === '.' ? 'App' : colors.cyan.bold(appName);

  spinner.succeed(`${scaffoldedName} scaffolded successfully!\n`);

  if (!noInstall) installPackages(pkgManager, projectDir);
  if (!noGit) initGit(projectDir);
}
