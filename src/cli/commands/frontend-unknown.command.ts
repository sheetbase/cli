import {ProjectService} from '../../lib/services/project.service';
import {TerminalService} from '../../lib/services/terminal.service';

export interface FrontendUnknownCommandOptions {
  parent: {
    rawArgs: string[];
  };
}

export class FrontendUnknownCommand {
  constructor(
    private projectService: ProjectService,
    private terminalService: TerminalService
  ) {}

  async run(command: string, commandOptions: FrontendUnknownCommandOptions) {
    this.terminalService.run(
      'npm run ' + command,
      command,
      commandOptions['parent']['rawArgs'],
      this.projectService.FRONTEND_DIR
    );
  }
}
