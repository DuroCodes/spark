import { SparkCommand, CommandType } from '@spark.ts/handler';
import { ownerOnlySlash } from '../../plugins/ownerOnly.js';

export default new SparkCommand({
  type: CommandType.Slash,
  plugins: [ownerOnlySlash(['283312847478325251'])],
  run({ interaction }) {
    interaction.reply('You are allowed to use this command!');
  },
});
