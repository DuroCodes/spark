// IMPORTS \\
import {CommandPlugin,CommandType,Command} from "@spark.ts/handler";
import * as Discord from "discord.js";

// TYPES \\
type RemoveMethods<T> = T extends {} ? {
    [P in keyof T as T[P] extends (...args: any[]) => unknown ? never : P]: RemoveMethods<T[P]>;
} : T;

type ConditionalMethod = (args: {
    command: Command,
    interaction: RemoveMethods<Discord.ChatInputCommandInteraction>,
    message: RemoveMethods<Discord.Message>
}) => unknown

interface Conditional{
    condition: ConditionalMethod | unknown;
    onFalse?: string;
}

// EXPORTS \\
export function Guard(...conditionals: Conditional[]): CommandPlugin<CommandType.Both>{
    return {
        name: "guard",
        description: "Checks through a list of defined conditions before running a command.",
        run({command,controller,message,interaction}){
            for(const conditional of conditionals){
                let condition = conditional.condition;
                if(typeof conditional.condition === "function"){
                    condition = conditional.condition({command,message,interaction});
                }

                if(!condition){
                    if("onFalse" in conditional){
                        if(command.type === CommandType.Slash) interaction?.reply(conditional.onFalse!);
                        else if(command.type === CommandType.Text) message?.reply(conditional.onFalse!);
                    }
                    return controller.stop();
                }
            }

            return controller.next();
        }
    }
}

// HELPERS \\
export abstract class Helpers{
    static InGuild(guilds: string[]): ConditionalMethod{
        return ({command,message,interaction}) => guilds.includes((command.type === "slash" ? interaction : message).guildId!);
    }

    static InChannel(channels: string[]): ConditionalMethod{
        return ({command,message,interaction}) => channels.includes((command.type === "slash" ? interaction : message).channelId!);
    }
}