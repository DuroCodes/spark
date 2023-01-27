import { CommandPlugin, CommandType } from '@spark.ts/handler';

function mapUsers(ids: string[]) {
  const mention = (s: string) => `<@!${s}>`;
  return ids.map((id) => `\` - \` ${mention(id)}`).join('\n');
}

export function ownerOnly(ownerIds: string[]): CommandPlugin<CommandType.Both> {
  return {
    name: 'Owner Only',
    description: 'Only allows the owner(s) to run the command.',
    async run({
      controller, command, message, interaction,
    }) {
      if (command.type === CommandType.Text) {
        if (ownerIds.includes(message!.author.id)) {
          return controller.next();
        }

        await message!.reply(`Only these people can run the command!\n${mapUsers(ownerIds)}`);
      }

      if (command.type === CommandType.Slash) {
        if (ownerIds.includes(interaction!.user.id)) {
          return controller.next();
        }

        await interaction?.reply({
          content: `Only these people can run the command!\n${mapUsers(ownerIds)}`,
          ephemeral: true,
        });
      }

      return controller.stop();
    },
  };
}
