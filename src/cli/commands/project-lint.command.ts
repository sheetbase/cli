import {BackendLintCommand} from './backend-lint.command';
import {FrontendLintCommand} from './frontend-lint.command';

export class ProjectLintCommand {
  constructor(
    private backendLintCommand: BackendLintCommand,
    private frontendLintCommand: FrontendLintCommand
  ) {}

  async run() {
    await this.backendLintCommand.run();
    this.frontendLintCommand.run();
  }
}
