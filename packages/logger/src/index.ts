/* eslint-disable no-console */
/* eslint-disable max-classes-per-file */
import colors from 'ansi-colors';
import { format } from 'util';

export type LogLevel = 'success' | 'error' | 'warn' | 'info' | 'debug';
export type LogStyle = 'bracket' | 'highlight';

type LoggerTitle = {
  [key in LogStyle]: string
};

type LoggerData = {
  [key in LogLevel]: {
    title: LoggerTitle;
    level: number;
    color: keyof typeof colors.styles;
  };
};

const loggerInfo: LoggerData = {
  success: {
    title: {
      highlight: colors.greenBright.inverse.bold(' SUCCESS '),
      bracket: colors.greenBright.bold('[SUCCESS]'),
    },
    color: 'greenBright',
    level: 5,
  },
  error: {
    title: {
      highlight: colors.redBright.inverse.bold('  ERROR  '),
      bracket: colors.redBright.bold('[ ERROR ]'),
    },
    color: 'redBright',
    level: 4,
  },
  warn: {
    title: {
      highlight: colors.yellowBright.inverse.bold('  WARN   '),
      bracket: colors.yellowBright.bold('[ WARN  ]'),
    },
    color: 'yellowBright',
    level: 3,
  },
  info: {
    title: {
      highlight: colors.cyanBright.inverse.bold('  INFO   '),
      bracket: colors.cyanBright.bold('[ INFO  ]'),
    },
    color: 'cyanBright',
    level: 2,
  },
  debug: {
    title: {
      highlight: colors.magentaBright.inverse.bold('  DEBUG  '),
      bracket: colors.magentaBright.bold('[ DEBUG ]'),
    },
    color: 'magentaBright',
    level: 1,
  },
};

type LogMessages = {
  [key in LogLevel]: string
};

interface LoggerOptions {
  /**
   * The log level of the logger.
   * If you're using a method with a lower level than you have set, it won't display.
   * @example
   * ```ts
   * const logger = new Logger({
   *   logLevel: 'error',
   * });
   * logger.debug('hello'); // won't display since debug < error
   * logger.success('hello'); // will display since success >= error
   * ```
   */
  logLevel?: LogLevel;
  /**
   * The log style of the logger.
   * Determines the stylized output of the log
   */
  logStyle?: LogStyle;
  /**
   * Custom messages for the logger.
   * Use this to have custom format or to override the default format.
   * Use {msg} in your string to represent the message being logged
   */
  messages?: LogMessages;
}

export class Logger extends console.Console {
  private logLevel: LogLevel = 'debug';

  private logStyle: LogStyle = 'highlight';

  private messages?: LogMessages;

  /**
   * @option
   * `logLevel`: The log level of the logger.
   * If you're using a method with a lower level than you have set, it won't display.
   * @option
   * `logStyle`: The style of the logger, 'highlight' or 'bracket'.
   * This is used to style the logger. You can override this with the `messages` option.
   * @option
   * `messages`: Custom messages for the logger.
   * Use an object with keys that have each of the log levels in them.
   * Use `{msg}` to represent the message being logged.
   * @example
   * ```
   * messages: {
   *   info: 'INFO: {msg}',
   *   error: 'ERROR: {msg}',
   *   // ...,
   * }
   * ```
   */
  constructor(options?: LoggerOptions) {
    super({ stdout: process.stdout });
    Object.assign(this, options);
  }

  /**
   * Returns whether the existing log level is higher than the current.
   * This is used to determine whether to log a message or ignore it.
   */
  private checkLevel(log: LogLevel) {
    const existingLevel = loggerInfo[this.logLevel].level;
    const { level } = loggerInfo[log];
    return (existingLevel <= level);
  }

  /**
   * The function to log a message.
   */
  private logMessage(message: string, level: LogLevel) {
    if (this.messages) {
      const msg = this.messages[level].replace('{msg}', message);
      return console.log(msg);
    }

    if (this.checkLevel(level)) {
      const { title, color } = loggerInfo[level];
      return console.log(`${title[this.logStyle]} ${colors[color](message)}`);
    }
  }

  /**
   * A success message. LogLevel: 5
   */
  success(...args: unknown[]) {
    this.logMessage(format(...args), 'success');
  }

  /**
   * An error message. Overrides `console.error()`. LogLevel: 4
   */
  override error(...args: unknown[]) {
    this.logMessage(format(...args), 'error');
  }

  /**
   * A warn message. LogLevel: 3
   */
  override warn(...args: unknown[]) {
    this.logMessage(format(...args), 'warn');
  }

  /**
   * An info message. LogLevel: 2
   */
  override info(...args: unknown[]) {
    this.logMessage(format(...args), 'info');
  }

  /**
   * A debug message. LogLevel: 1
   */
  override debug(...args: unknown[]) {
    this.logMessage(format(...args), 'debug');
  }
}

type LogFn = (...args: unknown[]) => unknown;
type CallbackLogFn = (msg: string) => string;

/**
 * A customizable logger with custom methods & titles.
 */
export class CustomLogger {
  /**
   * Configure the methods for the logger.
   */
  public setMethods<Methods extends Record<string, CallbackLogFn>>(methods: Methods) {
    return {
      /**
       * Sets the level of the logger. You can only see the logs from levels that are included here.
       */
      setLevel(level: (keyof Methods)[]) {
        const obj = {} as Record<keyof Methods, LogFn>;

        for (const key of Object.keys(methods) as (keyof Methods)[]) {
          obj[key] = (...args: unknown[]) => {
            if (!level.includes(key)) return;

            const msg = format(...args);

            console.log(methods[key]!(msg));
          };
        }

        return obj;
      },
    };
  }
}
