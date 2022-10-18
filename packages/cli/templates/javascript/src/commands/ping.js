const { SparkCommand, CommandType } = require('@spark.ts/handler');

export default new SparkCommand({
  type: CommandType.Slash,
  run({ interaction }) {
    interaction.reply('pong');
  },
});
