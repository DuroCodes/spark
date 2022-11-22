import { BaseCommand, CommandType, InputCommand } from '../types/command';
import { SlashCommandPlugin, TextCommandPlugin } from '../types/plugin';

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
   * Plugins used by the command. Defaults to `[]`
   */
  public plugins?: TextCommandPlugin[] | SlashCommandPlugin[];

  /**
   * The type of the command.
   * You can use the {@link CommandType} enum or the direct values. (`'slash'` or `'text'`)
   */
  public type!: CommandType;

  constructor(options: InputCommand) {
    Object.assign(this, options);
  }
}
