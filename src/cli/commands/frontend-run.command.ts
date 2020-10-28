import {ProjectService} from '../../lib/services/project.service';
import {TerminalService} from '../../lib/services/terminal.service';

export interface FrontendRunCommandOptions {
  parent: {
    rawArgs: string[];
  };
}

export class FrontendRunCommand {
  constructor(
    private projectService: ProjectService,
    private terminalService: TerminalService
  ) {}

  async run(command: string, commandOptions: FrontendRunCommandOptions) {
    this.terminalService.run(
      'npm run',
      command,
      commandOptions['parent']['rawArgs'],
      this.projectService.FRONTEND_DIR,
      true
    );
  }
}
