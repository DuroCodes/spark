import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  Client,
  CommandInteractionOptionResolver,
  Interaction,
} from 'discord.js';
import { SlashCommand } from '../types/command';
import * as Store from '../util/store';
import { BaseEvent } from './baseEvent';

async function slashCommandHandler(
  command: SlashCommand,
  interaction: ChatInputCommandInteraction,
) {
  try {
    return await command.run({
      client: interaction.client,
      interaction,
      args: interaction.options as CommandInteractionOptionResolver,
    });
  } catch (e) {
    return interaction.client.logger.error(e);
  }
}

export function onInteractionCreate(interaction: Interaction) {
  if (interaction.isChatInputCommand()) {
    const command = Store.applicationCommands[
      ApplicationCommandType.ChatInput
    ].get(interaction.commandName);

    if (!command) return;

    slashCommandHandler(command, interaction);
  }
}

export class InteractionHandler extends BaseEvent {
  public constructor(client: Client) {
    super(client);
    client.on('interactionCreate', onInteractionCreate);
  }
}
