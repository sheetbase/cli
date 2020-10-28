import {ProjectService} from '../../lib/services/project.service';
import {TerminalService} from '../../lib/services/terminal.service';

export interface BackendRunCommandOptions {
  parent: {
    rawArgs: string[];
  };
}

export class BackendRunCommand {
  constructor(
    private projectService: ProjectService,
    private terminalService: TerminalService
  ) {}

  async run(command: string, commandOptions: BackendRunCommandOptions) {
    this.terminalService.run(
      'npm run',
      command,
      commandOptions['parent']['rawArgs'],
      this.projectService.BACKEND_DIR,
      true
    );
  }
}
