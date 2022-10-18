#!/usr/bin/env node

import { Command } from 'commander';
import { initProject } from './commands/init.js';
import { version } from './util/version.js';

export const program = new Command();

program
  .name('create-spark')
  .version(version())
  .exitOverride(() => process.exit(0));

program
  .command('init')
  .description('quickly scaffold a spark bot')
  .option('-y', 'uses default settings (TypeScript)')
  .action(initProject);

program.parse();
