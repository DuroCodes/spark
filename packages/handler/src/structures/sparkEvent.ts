import { ClientEvents } from 'discord.js';
import { EventOptions, EventRunner } from '../types/event';

/**
 * The event class. Use this class to create new events in your bot.
 *
 * @example
 * ```ts
 * // TypeScript
 * import { SparkEvent } from '@spark.ts/handler';
 *
 * export default new SparkEvent({
 *   name: 'ready',
 *   run() {
 *     console.log('Online!');
 *   },
 * });
 * ```
 *
 * @example
 * ```js
 * // JavaScript (CJS)
 * const { SparkEvent } = require('@spark.ts/handler');
 *
 * exports.default = new SparkEvent({
 *   name: 'ready',
 *   run() {
 *     console.log('Online!');
 *   },
 * });
 * ```
 */
export class SparkEvent<Key extends keyof ClientEvents> implements EventOptions<Key> {
  /**
   * The name of the event. (Such as `'interactionCreate'`)
   */
  public name!: Key;

  /**
   * The run function for the event. {@link EventRunner}
   */
  public run!: EventRunner<Key>;

  /**
   * Whether the event should run once.
   */
  public once?: boolean;

  constructor(options: EventOptions<Key>) {
    Object.assign(this, options);
  }
}
