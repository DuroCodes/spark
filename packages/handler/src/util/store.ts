import { ApplicationCommandType, Collection } from 'discord.js';
import { SlashCommand, TextCommand } from '../types/command';
import { Processed } from '../types/util';

/**
 * `Store` stores all of the commands in an object so you can access them easily.
 */
export namespace Store {
  /**
   * The interaction commands.
   * Stores application commands, including slash and application commands.
  */
  // TODO: Add support for other command types. (Such as user commands)
  export const ApplicationCommands = {
    [ApplicationCommandType.ChatInput]: new Collection<string, Processed<SlashCommand>>(),
  };

  /**
   * The text commands.
   * Stores text commands and aliases for the handler.
   */
  export const TextCommands = {
    text: new Collection<string, Processed<TextCommand>>(),
    aliases: new Collection<string, Processed<TextCommand>>(),
  };
}
