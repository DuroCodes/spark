import {
  ApplicationCommandOptionData,
  ChatInputCommandInteraction,
  Client,
  CommandInteractionOptionResolver,
  Message,
} from 'discord.js';
import {
  AnyCommandPlugin,
  AnyInitPlugin,
  CommandPlugin,
  InitPlugin,
} from './plugin';

export enum CommandType {
  Text = 'text',
  Slash = 'slash',
  Both = 'both',
}

interface CommandOptionsDefs {
  [CommandType.Slash]: {
    client: Client;
    interaction: ChatInputCommandInteraction;
    args: CommandInteractionOptionResolver;
  };

  [CommandType.Text]: {
    client: Client;
    message: Message;
    args: string[];
  };
}

export interface BaseCommand {
  name?: string;
  description?: string;
  type: CommandType;
}

/**
 * A text command. Ran with a prefix, and can have aliases.
 */
export interface TextCommand extends BaseCommand {
  type: CommandType.Text;
  /**
   * Aliases for the command.
   * The command will be ran if any of these aliases are used with the prefix.
   */
  aliases?: string[];
  /**
   * Plugins that will be ran upon the command being used.
   */
  plugins?: (CommandPlugin<CommandType.Text> | CommandPlugin<CommandType.Both>)[];
  /**
   * Plugins that will be ran upon the command being initialized/loaded.
   */
  initPlugins?: (InitPlugin<CommandType.Text> | InitPlugin<CommandType.Both>)[];
  run: (options: CommandOptionsDefs[CommandType.Text]) => unknown;
}

export interface SlashCommand extends BaseCommand {
  type: CommandType.Slash;
  options?: ApplicationCommandOptionData;
  /**
   * Plugins that will be ran upon the command being used.
   */
  plugins?: (CommandPlugin<CommandType.Slash> | CommandPlugin<CommandType.Both>)[];
  /**
   * Plugins that will be ran upon the command being initialized/loaded.
   */
  initPlugins?: (InitPlugin<CommandType.Slash> | CommandPlugin<CommandType.Both>)[];
  run: (options: CommandOptionsDefs[CommandType.Slash]) => unknown;
}

/**
 * A both command represents both a `TextCommand` and a `SlashCommand` within the same object.
 * The `textRun` function will be called when the command is ran with a prefix.
 * The `slashRun` function will be called when the command is ran via a slash command.
 */
export interface BothCommand extends BaseCommand {
  type: CommandType.Both;
  options?: ApplicationCommandOptionData;
  /**
   * Aliases for the command.
   * The command will be ran if any of these aliases are used with the prefix.
   */
  aliases?: string[];
  /**
   * Plugins that will be ran upon the command being used.
   */
  plugins?: AnyCommandPlugin[];
  /**
   * Plugins that will be ran upon the command being initialized/loaded.
   */
  initPlugins?: AnyInitPlugin[];
  /**
   * Function that is ran whenever the command is called with a prefix.
   */
  textRun: (options: CommandOptionsDefs[CommandType.Text]) => unknown;
  /**
   * Function that is ran whenever the command is called via a slash command.
   */
  slashRun: (options: CommandOptionsDefs[CommandType.Slash]) => unknown;
}

export type Command = TextCommand | SlashCommand | BothCommand;
