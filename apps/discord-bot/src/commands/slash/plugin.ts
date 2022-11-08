import { SparkCommand, CommandType, SlashCommandPlugin } from '@spark.ts/handler';

function mapUsers(ids: string[]) {
  const userMention = (s: string) => `<@!${s}>`;
  return ids.map((id) => `\` - \` ${userMention(id)}`).join('\n');
}

function testPlugin(ownerIds: string[]): SlashCommandPlugin {
  return {
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

export default new SparkCommand({
  type: CommandType.Slash,
  plugins: [testPlugin(['283312847478325251'])],
  run({ interaction }) {
    interaction.reply('You are allowed to use this command!');
  },
});
