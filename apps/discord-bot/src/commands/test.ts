import { SparkCommand } from '@spark.ts/handler';

export default new SparkCommand({
  type: 'text',
  aliases: ['hello', 'test'],
  name: 'tests',
  run({ message }) {
    message.reply('pong');
  },
});
