import colors from 'ansi-colors';
import inquirer from 'inquirer';

export async function promptOverwriteDir(appName: string) {
  const { overwriteDir } = await inquirer.prompt<{ overwriteDir: 'abort' | 'clear' | 'overwrite'; }>({
    name: 'overwriteDir',
    type: 'list',
    message: `${colors.red.bold('Warning:')} ${colors.cyan.bold(appName)} already exists and isn't empty. How would you like to proceed?`,
    choices: [
      {
        name: 'Abort installation (recommended)',
        value: 'abort',
        short: 'Abort',
      },
      {
        name: 'Clear the directory and continue installation',
        value: 'clear',
        short: 'Clear',
      },
      {
        name: 'Continue installation and overwrite conflicting files',
        value: 'overwrite',
        short: 'Overwrite',
      },
    ],
    default: 'abort',
  });

  return overwriteDir;
}
