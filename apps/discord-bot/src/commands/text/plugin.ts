import { SparkCommand, CommandType } from '@spark.ts/handler';
import { ownerOnlyText } from '../../plugins/ownerOnly.js';

export default new SparkCommand({
  type: CommandType.Text,
  plugins: [ownerOnlyText(['283312847478325251'])],
  run({ message }) {
    message.reply('You are allowed to use this command!');
  },
});
