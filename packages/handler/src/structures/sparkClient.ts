import {
  ApplicationCommandType,
  BitFieldResolvable,
  CacheFactory,
  Client,
  ClientEvents,
  GatewayIntentsString,
  MessageMentionOptions,
  Partials,
  PresenceData,
  RESTOptions,
  Routes,
  SweeperOptions,
  WebSocketOptions,
} from 'discord.js';
import { globby } from 'globby';
import { parse } from 'path';
import { Logger, LogLevel } from '@spark.ts/logger';
import {
  CommandType,
  InputCommand,
} from '../types/command';
import { importFile } from '../util/importFile';
import * as Store from '../util/store';
import { InteractionHandler } from '../events/interactionCreate';
import { MessageHandler } from '../events/messageCreate';
import { SparkEvent } from './sparkEvent';

export interface SparkClientDirectories {
  /**
   * The folder with your commands.
   * If you're using TypeScript, point to your `dist` folder.
   */
  commands: string;

  /**
   * The folder with your commands.
   * If you're using TypeScript, point to your `dist` folder.
   */
  events: string;
}

export interface ClientOptions {
  shards?: number | number[] | 'auto';
  shardCount?: number;
  closeTimeout?: number;
  makeCache?: CacheFactory;
  allowedMentions?: MessageMentionOptions;
  partials?: Partials[];
  failIfNotExists?: boolean;
  presence?: PresenceData;
  intents: BitFieldResolvable<GatewayIntentsString, number>;
  waitGuildTimeout?: number;
  sweepers?: SweeperOptions;
  ws?: WebSocketOptions;
  rest?: Partial<RESTOptions>;
  jsonTransformer?: (obj: unknown) => unknown;
}

export interface SparkClientOptions extends ClientOptions {
  /**
   * Directories used by the client.
   * If you're using TypeScript, point this to your `dist` folder directories!
   */
  directories?: Partial<SparkClientDirectories>;

  /**
   * The log level for the logger {@link LogLevel}
   */
  logLevel?: LogLevel;

  /**
   * The prefix used for text commands
   */
  prefix?: string;
}

export class SparkClient<Ready extends boolean = boolean> extends Client<Ready> {
  /**
   * The log level used by the logger.
   */
  public override logLevel: LogLevel = 'debug';

  /**
   * The logger to be used by the handler.
   * Logger implemented by `@spark.ts/logger`
   */
  public override logger: Logger;

  /**
   * The directories used for the handler.
   * @readonly
   * @example
   * ```ts
   * const client = new SparkClient({
   *   intents: [],
   *   directories: {
   *     commands: './src/commands',
   *     events: './src/events',
   *   },
   * });
   * ```
   */
  public override readonly directories: Readonly<SparkClientDirectories>;

  /**
   * The prefix used for text commands.
   * @readonly
   */
  public override readonly prefix?: string;

  public constructor(options: SparkClientOptions) {
    super({ ...options });

    this.directories = {
      commands: options.directories?.commands ?? './src/commands',
      events: options.directories?.events ?? './src/events',
    };

    this.logLevel = options.logLevel ?? 'debug';

    this.prefix = options.prefix ?? '!';

    this.logger = new Logger({ logLevel: this.logLevel });
  }

  /**
   * Registers the slash & text commands for the client.
   */
  private async initCommands(clientId: string) {
    const commandFiles = await globby(`${this.directories.commands}/**/*{.js,.ts}`);

    for await (const path of commandFiles) {
      const command = await importFile<InputCommand>(path);

      const cmd = {
        ...command,
        name: command.name ?? parse(path).name,
        description: command.description ?? '...',
      };

      if (cmd.type === CommandType.Slash) {
        this.logger.debug(`Registered Slash Command: ${cmd.name}`);

        Store.applicationCommands[
          ApplicationCommandType.ChatInput
        ].set(cmd.name, cmd);
      }

      if (cmd.type === CommandType.Text) {
        this.logger.debug(`Registered Text Command: ${cmd.name}`);

        Store.textCommands.text.set(cmd.name, cmd);

        if (cmd.aliases) {
          cmd.aliases.forEach((alias) => Store.textCommands.aliases.set(alias, cmd));
        }
      }
    }

    const body = Store.applicationCommands[ApplicationCommandType.ChatInput].map(
      ({ name, description, options }) => ({ name, description, options }),
    );

    try {
      await this.rest.put(Routes.applicationCommands(clientId), {
        body,
      });

      this.logger.info(`Registered global slash commands. (${body.length} Loaded)`);
    } catch (e) {
      this.logger.error(e);
    }
  }

  /**
   * Registers the event listeners for the client.
   */
  public async initEvents() {
    const eventFiles = await globby(`${this.directories.events}/**/*{.js,.ts}`);

    for await (const path of eventFiles) {
      const event = await importFile<SparkEvent<keyof ClientEvents>>(path);

      const evt: SparkEvent<keyof ClientEvents> = {
        ...event,
        name: event.name ?? parse(path).name,
        once: event.once ?? false,
      };

      if (evt.once) {
        this.on(evt.name, evt.run);
      }

      if (!evt.once) {
        this.on(evt.name, evt.run);
      }
    }
  }

  /**
   * Initializes the commands and registers slash commands if available.
   */
  private async init(clientId: string) {
    this.initCommands(clientId);
    this.initEvents();
  }

  /**
   * Registers the handler and logs into the bot.
   * Usage: `client.start(token, clientId)`
   */
  async start(token: string, clientId: string) {
    this.init(clientId);

    new InteractionHandler(this);
    new MessageHandler(this);

    super.login(token);
  }
}

declare module 'discord.js' {
  interface Client {
    logger: Logger;
    logLevel: LogLevel;
    readonly directories: Readonly<SparkClientDirectories>;
    readonly prefix?: string;
  }

  interface ClientOptions extends SparkClientOptions { }
}
