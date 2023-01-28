import { SparkCommand, CommandType, Plugins } from '@spark.ts/handler';
import { ownerOnly } from '../../plugins/ownerOnly.js';

export default new SparkCommand({
  type: CommandType.Slash,
  description: 'Responds with "Hello!" to the owner.',
  initPlugins: [Plugins.Publish()],
  plugins: [ownerOnly(['283312847478325251'])],
  run({ interaction }) {
    interaction.reply('Hello!');
  },
});
