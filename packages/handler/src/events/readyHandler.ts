import { ApplicationCommandType, Client, ClientEvents } from 'discord.js';
import { Err, Ok, Result } from 'ts-results-es';
import { parse } from 'path';
import { match } from 'ts-pattern';
import glob from 'fast-glob';
import { Controller } from '../types/plugin';
import { Command, CommandType, DefinedCommand } from '../types/command';
import { BaseEvent } from './baseEvent';
import { Store } from '../util/store';
import { importFile } from '../util/importFile';
import { controller } from '../util/controller';
import { Event } from '../types/event';

function intoDefinedEvent(
  { path, event }: { path: string; event: Event; },
) {
  return {
    ...event,
    name: event.name ?? parse(path).name,
    once: event.once ?? false,
    run: event.run ?? (() => null),
  };
}

function registerEvent(event: Event, client: Client): Result<void, void> {
  return match<Event>(event)
    .with({ once: true }, (evt) => {
      client.logger.debug(`Registered 'once' event listener: ${evt.name}.`);
      client.once(evt.name, evt.run);
      return Ok.EMPTY;
    })
    .with({ once: false }, (evt) => {
      client.logger.debug(`Registered event listener: ${evt.name}.`);
      client.on(evt.name, evt.run);
      return Ok.EMPTY;
    })
    .otherwise(() => Err.EMPTY);
}

function registerCommand(command: DefinedCommand, client: Client): Result<void, void> {
  return match<DefinedCommand>(command)
    .with({ type: CommandType.Text }, (cmd) => {
      cmd.aliases?.forEach((a) => Store.TextCommands.aliases.set(a, cmd));
      Store.TextCommands.text.set(cmd.name, cmd);
      client.logger.debug(`Registered text command: ${cmd.name}.`);
      return Ok.EMPTY;
    })
    .with({ type: CommandType.Slash }, (cmd) => {
      Store.ApplicationCommands[ApplicationCommandType.ChatInput].set(cmd.name, cmd);
      client.logger.debug(`Registered slash command: ${cmd.name}.`);
      return Ok.EMPTY;
    })
    .otherwise(() => Err.EMPTY);
}

function intoDefinedCommand(
  { path, command }: { path: string; command: Command; },
): DefinedCommand {
  return {
    ...command,
    name: command?.name ?? parse(path).name,
    description: command?.description ?? '...',
  };
}

function processPlugins(
  { command, client, controller }: { command: Command; client: Client; controller: Controller; },
) {
  if (command.type === CommandType.Slash) {
    command.plugins?.forEach(async (plugin) => {
      if (!plugin.preprocess) return;

      await plugin.run({
        client,
        controller,
        command,
      });
    });
  }

  if (command.type === CommandType.Text) {
    command.plugins?.forEach(async (plugin) => {
      if (!plugin.preprocess) return;

      await plugin.run({
        client,
        controller,
        command,
      });
    });
  }
}

export class ReadyHandler extends BaseEvent {
  public constructor(client: Client) {
    super(client);
    this.initEvents(client);
    client.on('ready', this.initCommands);
  }

  private async initCommands(client: Client) {
    const commandFiles = await glob(`${client.directories.commands}/**/*{.js,.ts}`);

    commandFiles.forEach(async (path) => {
      const command = await importFile<Command>(path);
      const cmd = intoDefinedCommand({ path, command });

      registerCommand(cmd, client);
      processPlugins({ command: cmd, client, controller });
    });
  }

  private async initEvents(client: Client) {
    const eventFiles = await glob(`${client.directories.events}/**/*{.js,.ts}`);

    eventFiles.forEach(async (path) => {
      const event = await importFile<Event>(path);
      const evt = intoDefinedEvent({ path, event });

      registerEvent(evt, client);
    });
  }
}
