import {
  ApplicationCommandOptionData,
  Awaitable,
  ChatInputCommandInteraction,
  Client,
  CommandInteractionOptionResolver,
  Message,
} from 'discord.js';
import { SlashCommandPlugin, TextCommandPlugin } from './plugin';
import { DefinitelyDefined, Override } from './util';

export enum CommandType {
  Text = 'text',
  Slash = 'slash',
}

export interface BaseCommand {
  name?: string;
  description?: string;
  type: CommandType | `${CommandType}`;
}

export type TextCommand = Override<
  BaseCommand,
  {
    type: CommandType.Text | `${CommandType.Text}`;
    aliases?: string[];
    plugins?: TextCommandPlugin[];
    run: (options: {
      client: Client;
      message: Message;
      args: string[];
    }) => Awaitable<void | unknown>;
  }
>;

export type SlashCommand = Override<
  BaseCommand,
  {
    type: CommandType.Slash | `${CommandType.Slash}`;
    options?: ApplicationCommandOptionData[];
    plugins?: SlashCommandPlugin[];
    run: (options: {
      client: Client;
      interaction: ChatInputCommandInteraction;
      args: CommandInteractionOptionResolver;
    }) => Awaitable<void | unknown>;
  }
>;

export type CommandDefs = {
  [CommandType.Text]: TextCommand;
  [CommandType.Slash]: SlashCommand;
};

export type Command = TextCommand | SlashCommand;

export type InputCommand = {
  [T in CommandType]: CommandDefs[T]
}[CommandType];

export type DefinedCommand = DefinitelyDefined<Command, 'name' | 'description'>;
