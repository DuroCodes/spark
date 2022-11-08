import { SparkCommand, CommandType, TextCommandPlugin } from '@spark.ts/handler';

function mapUsers(ids: string[]) {
  const userMention = (s: string) => `<@!${s}>`;
  return ids.map((id) => `\` - \` ${userMention(id)}`).join('\n');
}

function testPlugin(ownerIds: string[]): TextCommandPlugin {
  return {
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

export default new SparkCommand({
  type: CommandType.Text,
  plugins: [testPlugin(['123'])],
  run({ message }) {
    message.reply('You are allowed to use this command!');
  },
});
