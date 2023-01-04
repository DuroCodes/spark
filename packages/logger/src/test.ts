import { Logger } from './index';

const logger = new Logger({
  messages: {
    debug: 'Debug : {msg}',
    error: 'Error : {msg}',
    info: 'Info : {msg}',
    warn: 'Info : {msg}',
    success: 'Info : {msg}',
  },
  logLevel: 'debug',
});

['debug', 'error', 'info', 'warn', 'success'].forEach((v) => {
  logger[v]('Hello World!');
});
