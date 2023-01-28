# Spark Handler

> A Discord.js Handler built on [TypeScript](https://typescriptlang.org) <img src="https://raw.githubusercontent.com/remojansen/logo.ts/master/ts.png" width="15"/>

## **Installation**

- To install, run `npm i @spark.ts/handler`.

## **Example Usage**

**TypeScript / ESM**
```ts
import { SparkClient } from '@spark.ts/handler';

const client = new SparkClient({
  intents: ['Guilds', 'MessageContent', 'GuildMessages'], // djs intents
  directories: {
    commands: './src/commands', // point this to the ./dist/commands directory if you're using typescript
  },
  logLevel: 'info', // log level used for the logger, if this is on `debug`, you'll see debug messages
});

client.login(process.env.DISCORD_TOKEN);
```

**CommonJS**
```js
const { SparkClient } = require('@spark.ts/handler');

const client = new SparkClient({
  intents: ['Guilds', 'MessageContent', 'GuildMessages'], // djs intents
  directories: {
    commands: './src/commands', // point this to the ./dist/commands directory if you're using typescript
  },
  logLevel: 'info', // log level used for the logger, if this is on `debug`, you'll see debug messages
});

client.login(process.env.DISCORD_TOKEN);
```
