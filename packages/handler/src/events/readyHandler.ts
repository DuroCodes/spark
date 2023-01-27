import { ApplicationCommandType, Client } from 'discord.js';
import { Err, Ok, Result } from 'ts-results-es';
import { parse } from 'path';
import { match } from 'ts-pattern';
import glob from 'fast-glob';
import { Controller } from '../types/plugin';
import {
  Command,
  CommandType,
  SlashCommand,
  TextCommand,
} from '../types/command';
import { Processed } from '../types/util';
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

function registerCommand(command: Processed<Command>, client: Client): Result<void, void> {
  return match<Processed<Command>>(command)
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
    .with({ type: CommandType.Both }, (cmd) => {
      const sharedProps = {
        name: cmd.name,
        description: cmd.description,
        plugins: cmd.plugins,
        initPlugins: cmd.initPlugins,
      };

      const textCmd = {
        type: CommandType.Text,
        run: cmd.textRun,
        aliases: cmd.aliases,
        ...sharedProps,
      };

      const slashCmd = {
        type: CommandType.Slash,
        run: cmd.slashRun,
        options: cmd.options,
        ...sharedProps,
      };

      cmd.aliases?.forEach((a) => Store.TextCommands.aliases.set(a, textCmd as TextCommand));

      Store.TextCommands.text.set(cmd.name, textCmd as TextCommand);

      Store.ApplicationCommands[
        ApplicationCommandType.ChatInput
      ].set(cmd.name, slashCmd as SlashCommand);

      client.logger.debug(`Registered both command: ${cmd.name}.`);

      return Ok.EMPTY;
    })
    .otherwise(() => Err.EMPTY);
}

function intoDefinedCommand(
  { path, command }: { path: string; command: Command; },
) {
  return {
    ...command,
    name: command?.name ?? parse(path).name,
    description: command?.description ?? '...',
  };
}

async function processPlugins(
  { command, client, controller }: { command: Command; client: Client; controller: Controller; },
) {
  if (command.initPlugins) {
    if (command.type === CommandType.Slash) {
      for await (const plugin of command.initPlugins) {
        await plugin.run({
          client,
          controller,
          command,
        });
      }
    }

    if (command.type === CommandType.Text) {
      for await (const plugin of command.initPlugins) {
        await plugin.run({
          client,
          controller,
          command,
        });
      }
    }
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
