import {
  Awaitable,
  ChatInputCommandInteraction,
  Client,
  Message,
} from 'discord.js';
import { Err, Ok, Result } from 'ts-results-es';
import { SlashCommand, TextCommand } from './command';
import { Override } from './util';

export interface Controller {
  next: () => Ok<void>;
  stop: () => Err<void>;
}

export interface BasePlugin {
  name?: string;
  description?: string;
  preprocess?: boolean;
  run: () => Awaitable<Result<void, void>>;
}

export type PreprocessTextCommandPlugin = Override<
  BasePlugin,
  {
    preprocess: true,
    run: (options: {
      client: Client,
      controller: Controller;
      command: TextCommand;
    }) => Awaitable<Result<void, void>>;
  }
>;

export type PreprocessSlashCommandPlugin = Override<
  BasePlugin,
  {
    preprocess: true,
    run: (options: {
      client: Client,
      controller: Controller;
      command: SlashCommand;
    }) => Awaitable<Result<void, void>>;
  }
>;

export type NonPreprocessTextCommandPlugin = Override<
  BasePlugin,
  {
    preprocess: false,
    run: (options: {
      client: Client;
      message: Message;
      controller: Controller;
      command: TextCommand;
    }) => Awaitable<Result<void, void>>;
  }
>;

export type NonPreprocessSlashCommandPlugin = Override<
  BasePlugin,
  {
    preprocess: false,
    run: (options: {
      client: Client;
      interaction: ChatInputCommandInteraction;
      controller: Controller;
      command: SlashCommand;
    }) => Awaitable<Result<void, void>>;
  }
>;

export type NonPreprocessCommandPlugin =
  NonPreprocessTextCommandPlugin | NonPreprocessSlashCommandPlugin;

export type PreprocessCommandPlugin =
  PreprocessTextCommandPlugin | PreprocessSlashCommandPlugin;

export type SlashCommandPlugin = NonPreprocessSlashCommandPlugin | PreprocessSlashCommandPlugin;
export type TextCommandPlugin = NonPreprocessTextCommandPlugin | PreprocessTextCommandPlugin;

export type CommandPlugin = PreprocessCommandPlugin | NonPreprocessCommandPlugin;
