import {
  Awaitable,
  ChatInputCommandInteraction,
  Client,
  Message,
} from 'discord.js';
import { Err, Ok, Result } from 'ts-results-es';
import { Override } from './util';

export interface Controller {
  next: () => Ok<void>;
  stop: () => Err<void>;
}

export interface BasePlugin {
  name?: string;
  description?: string;
  run: () => Awaitable<void | unknown>;
}

export type TextCommandPlugin = Override<
  BasePlugin,
  {
    run: (options: {
      client: Client;
      message: Message;
      controller: Controller;
    }) => Awaitable<Result<void, void>>;
  }
>;

export type SlashCommandPlugin = Override<
  BasePlugin,
  {
    run: (options: {
      client: Client;
      interaction: ChatInputCommandInteraction;
      controller: Controller;
    }) => Awaitable<Result<void, void>>;
  }
>;
