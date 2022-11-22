import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  Client,
  CommandInteractionOptionResolver,
  Interaction,
} from 'discord.js';
import { SlashCommand } from '../types/command';
import { Store } from '../util/store';
import { controller } from '../util/controller';
import { BaseEvent } from './baseEvent';

async function slashCommandHandler(
  command: SlashCommand,
  interaction: ChatInputCommandInteraction,
) {
  try {
    if (command.plugins) {
      for await (const plugin of command.plugins) {
        if (plugin.preprocess) continue;

        const { err } = await plugin.run({
          client: interaction.client,
          interaction,
          controller,
          command,
        });

        if (err) return;
      }
    }

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
    const command = Store.ApplicationCommands[
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
