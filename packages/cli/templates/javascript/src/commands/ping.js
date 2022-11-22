const { SparkCommand, CommandType, Plugins } = require('@spark.ts/handler');

module.exports = new SparkCommand({
  type: CommandType.Slash,
  plugins: [Plugins.Publish()],
  run({ interaction }) {
    interaction.reply('pong');
  },
});
