import { SparkCommand, CommandType, Plugins } from '@spark.ts/handler';
import { ownerOnlySlash } from '../../plugins/ownerOnly.js';

export default new SparkCommand({
  type: CommandType.Slash,
  plugins: [Plugins.Publish(), ownerOnlySlash(['283312847478325251'])],
  run({ interaction }) {
    interaction.reply('You are allowed to use this command!');
  },
});
