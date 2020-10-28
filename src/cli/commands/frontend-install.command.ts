import {ProjectService} from '../../lib/services/project.service';
import {TerminalService} from '../../lib/services/terminal.service';

export interface FrontendInstallCommandOptions {
  parent: {
    rawArgs: string[];
  };
}

export class FrontendInstallCommand {
  constructor(
    private projectService: ProjectService,
    private terminalService: TerminalService
  ) {}

  async run(command: string, commandOptions: FrontendInstallCommandOptions) {
    this.terminalService.run(
      'npm uninstall',
      command,
      commandOptions['parent']['rawArgs'],
      this.projectService.FRONTEND_DIR
    );
  }
}
