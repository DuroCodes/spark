import { Awaitable, ClientEvents } from 'discord.js';

export type EventRunner<Key extends keyof ClientEvents> = (
  ...args: ClientEvents[Key]
) => Awaitable<void>;

export interface EventOptions<Key extends keyof ClientEvents> {
  name: Key;
  run: EventRunner<Key>;
  /**
   * Whether the event should be ran once or multiple times.
   */
  once?: boolean;
}

export type Event = EventOptions<keyof ClientEvents>;
