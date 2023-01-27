import { CommandType, Plugins, SparkCommand } from '@spark.ts/handler';

export default new SparkCommand({
  type: CommandType.Both,
  plugins: [Plugins.Publish()],
  aliases: ['hi'],
  slashRun({ interaction }) {
    interaction.reply('Hello!');
  },
  textRun({ message }) {
    message.reply('Hello!');
  },
});
