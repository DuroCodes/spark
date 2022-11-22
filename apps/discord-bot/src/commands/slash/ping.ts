import { SparkCommand, CommandType, Plugins } from '@spark.ts/handler';

export default new SparkCommand({
  type: CommandType.Slash,
  plugins: [Plugins.Publish()],
  run({ interaction }) {
    interaction.reply('Pong!');
  },
});
