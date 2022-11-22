import { ApplicationCommandType, Collection } from 'discord.js';
import { SlashCommand, TextCommand } from '../types/command';

export namespace Store {
  /**
   * The interaction commands.
   * Stores application commands, including slash and application commands.
  */
  // TODO: Add support for other command types. (Such as user commands)
  export const ApplicationCommands = {
    [ApplicationCommandType.ChatInput]: new Collection<string, SlashCommand>(),
  };

  /**
   * The text commands.
   * Stores text commands and aliases for the handler.
   */
  export const TextCommands = {
    text: new Collection<string, TextCommand>(),
    aliases: new Collection<string, TextCommand>(),
  };
}
