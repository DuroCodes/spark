import { BaseCommand, CommandType, InputCommand } from '../types/command';

export class SparkCommand implements BaseCommand {
  public name?: string;

  public description?: string;

  public type!: CommandType;

  constructor(options: InputCommand) {
    Object.assign(this, options);
  }
}
