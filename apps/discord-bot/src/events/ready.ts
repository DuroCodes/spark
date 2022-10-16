import { SparkEvent } from '@spark.ts/handler';

export default new SparkEvent({
  name: 'ready',
  run(client) {
    client.logger.success(`${client.user.tag} is now online!`);
  },
});
