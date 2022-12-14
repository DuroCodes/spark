import { Awaitable, ClientEvents } from 'discord.js';

export type EventRunner<Key extends keyof ClientEvents> = (
  ...args: ClientEvents[Key]
) => Awaitable<void>;

export interface EventOptions<Key extends keyof ClientEvents> {
  name: Key;
  run: EventRunner<Key>;
  once?: boolean;
}

export type Event = EventOptions<keyof ClientEvents>;
