import { BaseCommand, CommandType, Command } from '../types/command';

/**
 * The event class. Use this class to create new commands in your bot.
 *
 * @example
 * ```ts
 * // TypeScript
 * import { SparkCommand } from '@spark.ts/handler';
 *
 * export default new SparkCommand({
 *   name: 'ping',
 *   run({ interaction }) {
 *     interaction.reply('Pong!');
 *   },
 * });
 * ```
 *
 * @example
 * ```js
 * // JavaScript (CJS)
 * const { SparkCommand } = require('@spark.ts/handler');
 *
 * module.exports = new SparkCommand({
 *   name: 'ping',
 *   run({ interaction }) {
 *     interaction.reply('Pong!');
 *   },
 * });
 * ```
 */
export class SparkCommand implements BaseCommand {
  /**
   * The name of the command. Will default to the file's name without the shortcut.
   * Example: `foo.js` -> `'foo'`
   */
  public name?: string;

  /**
   * The description of the command. Will default to `'...'`
   */
  public description?: string;

  /**
   * The type of the command.
   * You can use the {@link CommandType} enum or the direct values. (`'slash'` or `'text'`)
   */
  public type!: CommandType;

  constructor(options: Command) {
    Object.assign(this, options);
  }
}
