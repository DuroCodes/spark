import {
  ApplicationCommandType,
  ChatInputApplicationCommandData,
  PermissionResolvable,
} from 'discord.js';
import { CommandType } from '../types/command';
import { CommandPlugin } from '../types/plugin';

const rawCommandType = {
  [CommandType.Slash]: ApplicationCommandType.ChatInput,
};

type GuildId = `${number}`;

export interface PublishOptions {
  /**
   * An array of guild ids for publication.
   * @default []
   */
  guildIds?: GuildId[];
  /**
   * Whether the command should be registered in DMs or not.
   * @default false
   */
  dmPermission?: boolean;
  /**
   * Member permissions to be able to use the command.
   * @default null
   */
  defaultMemberPermissions?: PermissionResolvable | null;
}

export function publish(opts?: PublishOptions): CommandPlugin<CommandType.Slash> {
  return {
    name: 'Publish plugin',
    description: 'Manage & publish slash commands',
    async run({ controller, client, command }) {
      const cat = (e: unknown) => {
        client.logger.error(`Publish plugin failed for ${command.name}.`);
        client.logger.error(e);
      };

      const defaultOptions: PublishOptions = {
        guildIds: [],
        dmPermission: false,
        defaultMemberPermissions: null,
      };

      const options: PublishOptions = { ...defaultOptions, ...opts };

      const { defaultMemberPermissions, dmPermission, guildIds } = options;

      try {
        const cmdData = {
          type: rawCommandType[command.type],
          name: command.name!,
          description: command.description!,
          options: command.options ?? [],
          defaultMemberPermissions,
          dmPermission,
        } as ChatInputApplicationCommandData;

        if (!guildIds?.length) {
          const cmd = (await client.application?.commands.fetch())?.find(
            (c) => c.name === command.name,
          );

          if (cmd && !cmd.equals(cmdData, true)) {
            client.logger.debug(`Found differences in global command ${command.name}.`);
            await cmd.edit(cmdData).catch(cat);

            client.logger.debug(`Command updated: ${command.name}.`);
            return controller.next();
          }

          await client.application?.commands.create(cmdData).catch(cat);
          client.logger.debug(`Updated global slash command: ${command.name}.`);
          return controller.next();
        }

        guildIds?.forEach(async (id) => {
          const guild = await client.guilds.fetch(id).catch(cat);

          if (!guild) return;

          const guildCmd = (await guild.commands.fetch()).find(
            (c) => c.name === command.name,
          );

          if (guildCmd && !guildCmd.equals(cmdData, true)) {
            client.logger.debug(`Found differences in command ${command.name}.`);
            await guildCmd.edit(cmdData).catch(cat);
            client.logger.debug(`Updated slash command: ${command.name}`);
          }

          return controller.next();
        });

        return controller.next();
      } catch (e) {
        client.logger.error(`${command.name} failed to register.`);
        client.logger.error(e);
        return controller.stop();
      }
    },
  };
}
