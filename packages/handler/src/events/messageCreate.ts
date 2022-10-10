import { Client, Message } from 'discord.js';
import { BaseEvent } from './baseEvent';
import * as Store from '../util/store';
import { TextCommand } from '../types/command';

async function textCommandHandler(
  command: TextCommand,
  message: Message,
  args: string[],
) {
  try {
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

  const command = Store.textCommands.text.get(cmd.toLocaleLowerCase())
    ?? Store.textCommands.aliases.get(cmd.toLocaleLowerCase());

  if (!command) return;

  textCommandHandler(command, message, args);
}

export class MessageHandler extends BaseEvent {
  public constructor(client: Client) {
    super(client);

    client.on('messageCreate', onMessageCreate);
  }
}
