import {ProjectService} from '../../lib/services/project.service';
import {TerminalService} from '../../lib/services/terminal.service';

export interface BackendUninstallCommandOptions {
  parent: {
    rawArgs: string[];
  };
}

export class BackendUninstallCommand {
  constructor(
    private projectService: ProjectService,
    private terminalService: TerminalService
  ) {}

  async run(command: string, commandOptions: BackendUninstallCommandOptions) {
    this.terminalService.run(
      'npm uninstall',
      command,
      commandOptions['parent']['rawArgs'],
      this.projectService.BACKEND_DIR
    );
  }
}
