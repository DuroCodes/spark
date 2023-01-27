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

export interface TextCommand extends BaseCommand {
  type: CommandType.Text;
  aliases?: string[];
  plugins?: (CommandPlugin<CommandType.Text> | CommandPlugin<CommandType.Both>)[];
  initPlugins?: (InitPlugin<CommandType.Text> | InitPlugin<CommandType.Both>)[];
  run: (options: CommandOptionsDefs[CommandType.Text]) => unknown;
}

export interface SlashCommand extends BaseCommand {
  type: CommandType.Slash;
  options?: ApplicationCommandOptionData;
  plugins?: (CommandPlugin<CommandType.Slash> | CommandPlugin<CommandType.Both>)[];
  initPlugins?: (InitPlugin<CommandType.Slash> | CommandPlugin<CommandType.Both>)[];
  run: (options: CommandOptionsDefs[CommandType.Slash]) => unknown;
}

export interface BothCommand extends BaseCommand {
  type: CommandType.Both;
  options?: ApplicationCommandOptionData;
  aliases?: string[];
  plugins?: AnyCommandPlugin[];
  initPlugins?: AnyInitPlugin[];
  textRun: (options: CommandOptionsDefs[CommandType.Text]) => unknown;
  slashRun: (options: CommandOptionsDefs[CommandType.Slash]) => unknown;
}

export type Command = TextCommand | SlashCommand | BothCommand;
