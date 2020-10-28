import {ProjectService} from '../../lib/services/project.service';
import {TerminalService} from '../../lib/services/terminal.service';

export interface FrontendUninstallCommandOptions {
  parent: {
    rawArgs: string[];
  };
}

export class FrontendUninstallCommand {
  constructor(
    private projectService: ProjectService,
    private terminalService: TerminalService
  ) {}

  async run(command: string, commandOptions: FrontendUninstallCommandOptions) {
    this.terminalService.run(
      'npm uninstall',
      command,
      commandOptions['parent']['rawArgs'],
      this.projectService.FRONTEND_DIR
    );
  }
}
