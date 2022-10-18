import inquirer from 'inquirer';
import { CliResults } from '../util/types.js';
import { validateAppName } from '../util/validateAppName.js';

/**
 * Asks the user for the name they'd like to use for the app.
 */
export async function promptAppName() {
  const { appName } = await inquirer.prompt<Pick<CliResults, 'appName'>>({
    type: 'input',
    name: 'appName',
    validate: validateAppName,
    default: 'my-spark-bot',
    transformer: (input: string) => input.trim(),
  });

  return appName;
}
