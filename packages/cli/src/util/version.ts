import { createRequire } from 'module';
import colors from 'ansi-colors';

const require = createRequire(import.meta.url);

export function version() {
  const { version } = require('../../package.json');
  return `Spark CLI ${colors.cyan(`v${version}`)}`;
}
