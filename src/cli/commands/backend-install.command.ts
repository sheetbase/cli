import {ProjectService} from '../../lib/services/project.service';
import {TerminalService} from '../../lib/services/terminal.service';

export interface BackendInstallCommandOptions {
  parent: {
    rawArgs: string[];
  };
}

export class BackendInstallCommand {
  constructor(
    private projectService: ProjectService,
    private terminalService: TerminalService
  ) {}

  async run(command: string, commandOptions: BackendInstallCommandOptions) {
    this.terminalService.run(
      'npm uninstall',
      command,
      commandOptions['parent']['rawArgs'],
      this.projectService.BACKEND_DIR
    );
  }
}
