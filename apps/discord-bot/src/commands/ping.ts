import { SparkCommand, CommandType } from '@spark.ts/handler';

export default new SparkCommand({
  type: CommandType.Slash,
  run({ interaction, client }) {
    client.logger.debug('pong');
    interaction.reply('pong');
  },
});
