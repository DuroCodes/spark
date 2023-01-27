import {
  Awaitable,
  ChatInputCommandInteraction,
  Client,
  Message,
} from 'discord.js';
import { Err, Ok, Result } from 'ts-results-es';
import {
  Command,
  CommandType,
  SlashCommand,
  TextCommand,
} from './command';

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

interface CommandPluginOptionsDefs {
  [CommandType.Both]: {
    client: Client;
    command: Command;
    controller: Controller;
    message?: Message;
    interaction?: ChatInputCommandInteraction;
  };

  [CommandType.Slash]: {
    client: Client;
    controller: Controller;
    command: SlashCommand;
    interaction: ChatInputCommandInteraction;
  };

  [CommandType.Text]: {
    client: Client;
    controller: Controller;
    command: TextCommand;
    message: Message;
  };
}

interface InitPluginOptionsDefs {
  [CommandType.Both]: {
    client: Client;
    controller: Controller;
    command: Command;
  };

  [CommandType.Slash]: {
    client: Client;
    controller: Controller;
    command: SlashCommand;
  };

  [CommandType.Text]: {
    client: Client;
    controller: Controller;
    command: TextCommand;
  };
}

export interface CommandPlugin<T extends CommandType> {
  name?: string;
  description?: string;
  run: (options: CommandPluginOptionsDefs[T]) => Awaitable<Result<void, void>>;
}

export interface InitPlugin<T extends CommandType> {
  name?: string;
  description?: string;
  run: (options: InitPluginOptionsDefs[T]) => Awaitable<Result<void, void>>;
}

export type AnyCommandPlugin =
  | CommandPlugin<CommandType.Both>
  | CommandPlugin<CommandType.Slash>
  | CommandPlugin<CommandType.Text>;

export type AnyInitPlugin =
  | InitPlugin<CommandType.Both>
  | InitPlugin<CommandType.Slash>
  | InitPlugin<CommandType.Text>;

export type AnyPlugin = AnyInitPlugin | AnyCommandPlugin;
