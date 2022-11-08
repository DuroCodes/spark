import { CommandType, SparkCommand } from '@spark.ts/handler';

export default new SparkCommand({
  type: CommandType.Text,
  run({ message }) {
    message.reply('Pong!');
  },
});
