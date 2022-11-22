import {
  BitFieldResolvable,
  CacheFactory,
  Client,
  GatewayIntentsString,
  MessageMentionOptions,
  Partials,
  PresenceData,
  RESTOptions,
  SweeperOptions,
  WebSocketOptions,
} from 'discord.js';
import { Logger, LogLevel } from '@spark.ts/logger';
import { InteractionHandler } from '../events/interactionCreate';
import { MessageHandler } from '../events/messageCreate';
import { ReadyHandler } from '../events/readyHandler';

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
  private logLevel: LogLevel = 'debug';

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
   * The prefix used for text commands. Defaults to '!'
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
   * Registers the handler and logs into the bot.
   * Usage: `client.login(token)`
   */
  override async login(token: string): Promise<string> {
    new InteractionHandler(this);
    new MessageHandler(this);
    new ReadyHandler(this);

    super.login(token);

    return this.token!;
  }
}

declare module 'discord.js' {
  interface Client {
    logger: Logger;
    readonly directories: Readonly<SparkClientDirectories>;
    readonly prefix?: string;
  }

  interface ClientOptions extends SparkClientOptions { }
}
