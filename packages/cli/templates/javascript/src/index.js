require('dotenv').config();
const { SparkClient } = require('@spark.ts/handler');

const client = new SparkClient({
  intents: ['Guilds', 'MessageContent', 'GuildMessages'],
  directories: {
    commands: './src/commands',
    events: './src/events',
  },
  logLevel: 'info',
});

client.start(process.env.DISCORD_TOKEN, process.env.CLIENT_ID);
