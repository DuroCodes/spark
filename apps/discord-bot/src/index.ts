import { SparkClient } from '@spark.ts/handler';
import { env } from './util/env.js';

const client = new SparkClient({
  intents: ['Guilds', 'MessageContent', 'GuildMessages'],
  directories: {
    commands: './dist/commands',
    events: './dist/events',
  },
  logLevel: 'debug',
});

client.login(env.DISCORD_TOKEN);
