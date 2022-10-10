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
  public name!: Key;

  public run!: EventRunner<Key>;

  public once?: boolean;

  constructor(options: EventOptions<Key>) {
    Object.assign(this, options);
  }
}
