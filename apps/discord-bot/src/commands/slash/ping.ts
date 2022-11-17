import { SparkCommand, CommandType } from '@spark.ts/handler';

export default new SparkCommand({
  type: CommandType.Slash,
  plugins: [],
  run({ interaction }) {
    interaction.reply('Pong!');
  },
});
