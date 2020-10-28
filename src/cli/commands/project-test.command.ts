import {BackendTestCommand} from './backend-test.command';
import {FrontendTestCommand} from './frontend-test.command';

export class ProjectTestCommand {
  constructor(
    private backendTestCommand: BackendTestCommand,
    private frontendTestCommand: FrontendTestCommand
  ) {}

  async run() {
    await this.backendTestCommand.run();
    this.frontendTestCommand.run();
  }
}
