import { CommandPlugin, CommandType, Command } from '@spark.ts/handler';
import { ChatInputCommandInteraction, Message } from 'discord.js';

type Immutable<T> = T extends {} ? {
  readonly [P in keyof T as T[P] extends (...args: any[]) => unknown ? never : P]: Immutable<T[P]>;
} : T;

export type Helper = (args: {
  command: Command,
  interaction: Immutable<ChatInputCommandInteraction>,
  message: Immutable<Message>;
}) => unknown;

interface Conditional {
  /**
   * The condition or helper to check.
   */
  condition: Helper | unknown;

  /**
   * How to reply to the user if the condition fails.
   */
  onFalse?: string;
}

/**
 * Accepts a number of conditions to check before running a command.
 * @param conditionals All of conditions to check
 * @example
 * export default new SparkCommand({
 *  description: "...",
 *  plugins: [
 *    Guard(
 *      {
 *        condition: Helpers.Not(Helpers.IsBot())
 *      }
 *    )
 *  ]
 * });
 */
export function Guard(...conditionals: Conditional[]): CommandPlugin<CommandType.Both> {
  return {
    name: 'guard',
    description: 'Checks through a list of defined conditions before running a command.',
    run({
      command, controller, message, interaction,
    }) {
      for (const conditional of conditionals) {
        let { condition } = conditional;
        if (typeof conditional.condition === 'function') {
          condition = conditional.condition({ command, message, interaction });
        }

        if (!condition) {
          if ('onFalse' in conditional) {
            if (command.type === CommandType.Slash) interaction?.reply(conditional.onFalse!);
            else if (command.type === CommandType.Text) message?.reply(conditional.onFalse!);
          }
          return controller.stop();
        }
      }

      return controller.next();
    },
  };
}

export const Helpers = {
  /**
   * Checks if the id of the server the command is used in is in a provided list of guild ids.
   * @param guilds Provided list of guild ids.
   */
  InGuild(guilds: string[]): Helper {
    return ({ command, message, interaction }) => guilds.includes((command.type === 'slash' ? interaction : message).guildId!);
  },

  /**
   * Checks if the id of the channel the command is used in is in a provided list of channel ids.
   * @param channels Provided list of channel ids.
   */
  InChannel(channels: string[]): Helper {
    return ({ command, message, interaction }) => channels.includes((command.type === 'slash' ? interaction : message).channelId!);
  },

  /**
   * Checks if the id of the user who used the command is in a provided list of user ids.
   * @param users Provided list of user ids.
   */
  ByUser(users: string[]): Helper {
    return ({ command, message, interaction }) => users.includes((command.type === "slash" ? interaction : message).member?.user.id!);
  },

  /**
   * Checks if the user who used the command is a discord bot or not.
   */
  IsBot(): Helper {
    return ({ command, message, interaction }) => (command.type === "slash" ? interaction : message).member?.user.bot!;
  },

  /**
   * Checks if the command was used in a discord server or not.
   */
  InServer(): Helper {
    return ({ command, message, interaction }) => (command.type === "slash" ? interaction : message).guild !== null;
  },

  /**
   * Accepts a helper function and returns true if the condition doesn't pass. Mimics `!` operator.
   * @param condition Helper function to test.
   * @example
   * export default new SparkCommand({
   *  description: "...",
   *  plugins: [
   *    Guard(
   *      {
   *        condition: Helpers.Not(Helpers.IsBot()) // don't use `!Helpers.IsBot()`
   *      }
   *    )
   *  ]
   * });
   */
  Not(condition: Helper): Helper {
    return (o) => !condition(o);
  },

  /**
   * Accepts 2 helper functions and if one turns out to be true then the condition passes. Mimics `||` operator.
   * @param x First helper function to test.
   * @param y Second helper function to test.
   * @example
   * export default new SparkCommand({
   *  description: "...",
   *  plugins: [
   *    Guard(
   *      {
   *        condition: Helpers.Or(Helpers.IsBot(),Helpers.InServer())
   *      }
   *    )
   *  ]
   * });
   */
  Or(x: Helper,y: Helper): Helper {
    return (o) => x(o) || y(o);
  }
}
