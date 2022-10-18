import { SparkCommand, CommandType } from '@spark.ts/handler';

export default new SparkCommand({
  type: CommandType.Text,
  aliases: ['hello', 'test'],
  name: 'tests',
  run({ message }) {
    message.reply('pong');
  },
});
