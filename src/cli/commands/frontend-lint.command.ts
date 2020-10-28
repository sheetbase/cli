import {ProjectService} from '../../lib/services/project.service';
import {TerminalService} from '../../lib/services/terminal.service';

export class FrontendLintCommand {
  constructor(
    private projectService: ProjectService,
    private terminalService: TerminalService
  ) {}

  async run() {
    this.terminalService.exec('npm run lint', this.projectService.FRONTEND_DIR);
  }
}
