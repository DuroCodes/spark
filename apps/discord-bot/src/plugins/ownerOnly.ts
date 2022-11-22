import { SlashCommandPlugin, TextCommandPlugin } from '@spark.ts/handler';

function mapUsers(ids: string[]) {
  const userMention = (s: string) => `<@!${s}>`;
  return ids.map((id) => `\` - \` ${userMention(id)}`).join('\n');
}

export function ownerOnlySlash(ownerIds: string[]): SlashCommandPlugin {
  return {
    preprocess: false,
    description: 'Only allows the owner to run the command.',
    async run({ interaction, controller }) {
      if (ownerIds.includes(interaction.user.id)) {
        return controller.next();
      }

      await interaction.reply({
        content: `Only these people can run this!\n${mapUsers(ownerIds)}`,
        ephemeral: true,
      });

      return controller.stop();
    },
  };
}

export function ownerOnlyText(ownerIds: string[]): TextCommandPlugin {
  return {
    preprocess: false,
    description: 'Only allows the owner to run the command.',
    async run({ message, controller }) {
      if (ownerIds.includes(message.author.id)) {
        return controller.next();
      }

      await message.reply({
        content: `Only these people can run this!\n${mapUsers(ownerIds)}`,
      });

      return controller.stop();
    },
  };
}
