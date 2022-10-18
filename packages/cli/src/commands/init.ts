import { promptAppName } from '../prompts/promptAppName.js';
import { promptGit } from '../prompts/promptGit.js';
import { promptInstall } from '../prompts/promptInstall.js';
import { promptLanguage } from '../prompts/promptLanguage.js';
import { CliResults } from '../util/types.js';
import { scaffoldProject } from '../helpers/scaffoldProject.js';

export const defaultOptions: CliResults = {
  appName: 'my-spark-app',
  pkgManager: 'npm',
  language: 'typescript',
  flags: {
    noGit: false,
    noInstall: false,
  },
};

export interface InitFlags {
  y: boolean; /** Whether to start the bot with default settings */
}

export async function initProject(flags: InitFlags) {
  const cliResults = defaultOptions;

  cliResults.appName = await promptAppName();

  if (flags.y) {
    cliResults.language = 'typescript';
    cliResults.pkgManager = 'npm';
    cliResults.flags = { noGit: false, noInstall: false };
  } else {
    cliResults.language = await promptLanguage();

    const { pkgManager, install } = await promptInstall();
    cliResults.pkgManager = pkgManager;
    cliResults.flags.noInstall = !install;

    cliResults.flags.noGit = !(await promptGit());
  }

  await scaffoldProject(cliResults);
}
