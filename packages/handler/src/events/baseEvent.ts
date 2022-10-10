import { Client } from 'discord.js';

export abstract class BaseEvent {
  protected constructor(protected client: Client) { }
}
