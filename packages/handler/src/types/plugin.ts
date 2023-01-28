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
import { Processed } from './util';

/**
 * Represents the controller object
 */
export interface Controller {
  /**
   * Continues plugin execution, runs the next plugin.
   */
  next: () => Ok<void>;
  /**
   * Stops plugin execution, doesn't run the next plugin.
   */
  stop: () => Err<void>;
}

/**
 * Base plugin type
 */
export interface BasePlugin {
  name?: string;
  description?: string;
  run: () => Awaitable<Result<void, void>>;
}

interface CommandPluginOptionsDefs {
  [CommandType.Both]: {
    client: Client;
    command: Processed<Command>;
    controller: Controller;
    message?: Message;
    interaction?: ChatInputCommandInteraction;
  };

  [CommandType.Slash]: {
    client: Client;
    controller: Controller;
    command: Processed<SlashCommand>;
    interaction: ChatInputCommandInteraction;
  };

  [CommandType.Text]: {
    client: Client;
    controller: Controller;
    command: Processed<TextCommand>;
    message: Message;
  };
}

interface InitPluginOptionsDefs {
  [CommandType.Both]: {
    client: Client;
    controller: Controller;
    command: Processed<Command>;
  };

  [CommandType.Slash]: {
    client: Client;
    controller: Controller;
    command: Processed<SlashCommand>;
  };

  [CommandType.Text]: {
    client: Client;
    controller: Controller;
    command: Processed<TextCommand>;
  };
}

/**
 * Represents a plugin that is ran upon the command being used.
 * Good for guards, reusability.
 */
export interface CommandPlugin<T extends CommandType> {
  name?: string;
  description?: string;
  run: (options: CommandPluginOptionsDefs[T]) => Awaitable<Result<void, void>>;
}

/**
 * Represents a plugin that is ran upon the command being loaded.
 * Good for pre-processing, or doing something with the data of the command.
 */
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
