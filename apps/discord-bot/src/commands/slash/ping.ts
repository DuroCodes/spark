import { SparkCommand, CommandType, Plugins } from '@spark.ts/handler';

export default new SparkCommand({
  type: CommandType.Slash,
  initPlugins: [Plugins.Publish()],
  run({ interaction }) {
    interaction.reply('Pong!');
  },
});
