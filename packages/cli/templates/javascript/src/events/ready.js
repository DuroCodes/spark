const { SparkEvent } = require('@spark.ts/handler');
const { Events } = require('discord.js');

export default new SparkEvent({
  name: Events.ClientReady,
  run(client) {
    client.logger.success(`${client.user.tag} is now online!`);
  },
});
