import { SparkCommand } from '@spark.ts/handler';

export default new SparkCommand({
  type: 'slash',
  run({ interaction, client }) {
    client.logger.debug('pong');
    interaction.reply('pong');
  },
});
