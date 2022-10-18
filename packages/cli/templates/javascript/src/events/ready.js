import { SparkEvent } from '@spark.ts/handler';
import { Events } from 'discord.js';

export default new SparkEvent({
  name: Events.ClientReady,
  run(client) {
    client.logger.success(`${client.user.tag} is now online!`);
  },
});
