import { CustomLogger, Logger } from './index';

const logger = new Logger({
  // messages: {
  //   debug: 'Debug : {msg}',
  //   error: 'Error : {msg}',
  //   info: 'Info : {msg}',
  //   warn: 'Info : {msg}',
  //   success: 'Info : {msg}',
  // },
  logLevel: 'debug',
});

['debug', 'error', 'info', 'warn', 'success'].forEach((v) => {
  logger[v]('Hello World!');
});

const customLogger = new CustomLogger()
  .setMethods({
    hello: (m) => `Hello ${m}`,
  })
  .setLevel(['hello']);

customLogger.hello('World!');
