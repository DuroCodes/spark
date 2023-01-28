import { Client, Message } from 'discord.js';
import { BaseEvent } from './baseEvent';
import { Store } from '../util/store';
import { TextCommand } from '../types/command';
import { controller } from '../util/controller';
import { Processed } from '../types/util';

async function textCommandHandler(
  command: Processed<TextCommand>,
  message: Message,
  args: string[],
) {
  try {
    if (command.plugins) {
      for await (const plugin of command.plugins) {
        const { err } = await plugin.run({
          client: message.client,
          message,
          controller,
          command,
        });

        if (err) return;
      }
    }
    return await command.run({
      client: message.client,
      message,
      args,
    });
  } catch (e) {
    return message.client.logger.error(e);
  }
}

export async function onMessageCreate(message: Message) {
  const { prefix } = message.client;

  if (typeof prefix === 'undefined') return;

  const [cmd, ...args] = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);

  if (!cmd) return;

  const command = Store.TextCommands.text.get(cmd.toLocaleLowerCase())
    ?? Store.TextCommands.aliases.get(cmd.toLocaleLowerCase());

  if (!command) return;

  textCommandHandler(command, message, args);
}

export class MessageHandler extends BaseEvent {
  public constructor(client: Client) {
    super(client);

    client.on('messageCreate', onMessageCreate);
  }
}
