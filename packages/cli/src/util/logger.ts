/* eslint-disable no-console */
import { format } from 'util';
import colors from 'ansi-colors';

export const logger = {
  error(...args: unknown[]) {
    console.log(colors.red(`${format(...args)}`));
  },
  warn(...args: unknown[]) {
    console.log(colors.yellow(`${format(...args)}`));
  },
  info(...args: unknown[]) {
    console.log(colors.cyan(`${format(...args)}`));
  },
  debug(...args: unknown[]) {
    console.log(colors.magenta(`${format(...args)}`));
  },
  success(...args: unknown[]) {
    console.log(colors.green(`${format(...args)}`));
  },
};
