import { CommandType, Plugins, SparkCommand } from '@spark.ts/handler';

export default new SparkCommand({
  type: CommandType.Both,
  initPlugins: [Plugins.Publish()],
  aliases: ['hi'],
  slashRun({ interaction }) {
    interaction.reply('Hello!');
  },
  textRun({ message }) {
    message.reply('Hello!');
  },
});
