import { SparkClient } from '@spark.ts/handler';
import { env } from './lib/env.js';

const client = new SparkClient({
  intents: ['Guilds', 'MessageContent', 'GuildMessages'],
  directories: {
    commands: './dist/commands',
    events: './dist/events',
  },
  logLevel: 'info',
});

client.start(env.DISCORD_TOKEN, env.CLIENT_ID);
