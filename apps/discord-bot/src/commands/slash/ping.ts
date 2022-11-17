import { SparkCommand, CommandType } from '@spark.ts/handler';

export default new SparkCommand({
  type: CommandType.Slash,
  run({ interaction }) {
    interaction.reply('Pong!');
  },
});
