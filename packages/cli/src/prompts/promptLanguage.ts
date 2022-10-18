import inquirer from 'inquirer';
import { logger } from '../util/logger.js';
import { CliResults } from '../util/types.js';

/**
 * Gets user input for the language they'd like to use for project.
 */
export async function promptLanguage() {
  const { language } = await inquirer.prompt<Pick<CliResults, 'language'>>({
    name: 'language',
    type: 'list',
    message: 'Will you be choosing TypeScript or JavaScript?',
    choices: [
      { name: 'TypeScript', value: 'typescript', short: 'TypeScript' },
      { name: 'JavaScript', value: 'javascript', short: 'JavaScript' },
    ],
  });

  if (language === 'typescript') {
    logger.success('Good choice, using TypeScript!');
  } else {
    logger.info('Sounds good! Using JavaScript.');
  }

  return language;
}
