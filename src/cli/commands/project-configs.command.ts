import {ConfigListCommand} from './config-list.command';

export class ProjectConfigsCommand {
  constructor(private configListCommand: ConfigListCommand) {}

  async run() {
    this.configListCommand.run();
  }
}
