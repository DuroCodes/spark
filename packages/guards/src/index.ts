import { CommandPlugin, CommandType, Command } from '@spark.ts/handler';
import { Interaction, Message, MessageReplyOptions, InteractionReplyOptions, MessagePayload, Collection } from 'discord.js';
import type { ReadonlyCollection } from "@discordjs/collection";

type Immutable<T> = T extends Map<infer K,infer V>
  ? ReadonlyMap<K,Immutable<V>>
  : T extends Array<infer U>
    ? ReadonlyArray<Immutable<U>>
    : T extends Collection<infer K,infer V>
      ? ReadonlyCollection<K,Immutable<V>>
      : T extends object ? {
        readonly [P in keyof T as T[P] extends (...args: any[]) => unknown ? never : P]: Immutable<T[P]>;
      } : T;

export type Helper = (args: {
  command: Command,
  interaction: Immutable<Interaction>,
  message: Immutable<Message>;
  like: Immutable<Interaction | Message>;
}) => unknown;

interface Conditional {
  /**
   * The condition or helper to check.
   */
  condition: Helper | unknown;

  /**
   * How to reply to the user if the condition fails.
   */
  onFalse?: string | (<Slash extends boolean>(isSlash: Slash) => (Slash extends true ? InteractionReplyOptions : MessageReplyOptions | MessagePayload) | string);

  /**
   * If `onFalse` is specified and the command is an interaction than it makes the response ephemeral automatically. Overrides `onFalse` ephemeral.
   */
  ephemeral?: boolean;
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
          condition = conditional.condition({ command, message, interaction, like: {...message, ...interaction} });
        }

        if (!condition) {
          if ('onFalse' in conditional) {
            if(typeof conditional.onFalse === "string")
              (command.type === CommandType.Slash ? interaction : message)?.reply(conditional.onFalse);
            else if (command.type === CommandType.Slash){
              const result = conditional.onFalse<true>(true);

              if(typeof result === "string"){
                interaction?.reply({
                  content: result,
                  ephemeral: conditional.ephemeral ? true : false
                });
              } else interaction?.reply({
                ...result,
                ephemeral: conditional.ephemeral ? true : false
              });
            } else if (command.type === CommandType.Text) message?.reply(conditional.onFalse<false>(false));
          }
          return controller.stop();
        }
      }

      return controller.next();
    }
  };
}

export const Helpers = {
  /**
   * Checks if the id of the server the command is used in is in a provided list of guild ids.
   * @param guilds Provided list of guild ids.
   */
  InGuild(guilds: string[]): Helper {
    return ({ like }) => guilds.includes(like.guildId!);
  },

  /**
   * Checks if the id of the channel the command is used in is in a provided list of channel ids.
   * @param channels Provided list of channel ids.
   */
  InChannel(channels: string[]): Helper {
    return ({ like }) => channels.includes(like.guildId!);
  },

  /**
   * Checks if the id of the user who used the command is in a provided list of user ids.
   * @param users Provided list of user ids.
   */
  ByUser(users: string[]): Helper {
    return ({ like }) => users.includes(like.member?.user.id!);
  },

  /**
   * Checks if the user who used the command is a discord bot or not.
   */
  IsBot(): Helper {
    return ({ like }) => like.member?.user.bot!;
  },

  /**
   * Checks if the command was used in a discord server or not.
   */
  InServer(): Helper {
    return ({ like }) => like.guild !== null;
  },

  /**
   * Checks if the command is an application command or not.
   */
  IsApplicationCommand(): Helper {
    return ({ command }) => command.type === CommandType.Slash;
  },

  /**
   * Checks the type of the interaction.
   * @deprecated This helper is an implementation for a future version of `@sparkts/handler`
   * @param type The type of interaction to check for. Is converted to InteractionType.
   */
  InteractionIsTypeOf(type: "ping" | "slash" | "component" | "autocomplete" | "modal"): Helper {
    const conversions = {
      ping: 1,
      slash: 2,
      component: 3,
      autocomplete: 4,
      modal: 5
    }

    return ({ interaction }) => interaction.type === conversions[type];
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
   *        condition: Helpers.Or(Helpers.IsBot(),Helpers.InServer()) // dont use `Helpers.IsBot() || Helpers.InServer()`
   *      }
   *    )
   *  ]
   * });
   */
  Or(helper: Helper,val: Helper | unknown): Helper {
    return (o) => helper(o) || (typeof val === "function" ? val(o) : val);
  },

  /**
   * Accepts a helper function and another argument that can also be a helper or any other type and compares them.
   * @param helper Helper function to compare.
   * @param val Either a value or a helper function.
   * @example
   * export default new SparkCommand({
   *  description: "...",
   *  plugins: [
   *    Guard(
   *      {
   *        condition: Helpers.EqualTo(Helpers.IsBot(),Helpers.InServer())
   *      }
   *    )
   *  ]
   * });
   */
  EqualTo(helper: Helper,val: Helper | unknown): Helper {
    return (o) => helper(o) === (typeof val === "function" ? val(o) : val);
  }
}
