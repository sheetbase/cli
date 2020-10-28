import {ProjectService} from '../../lib/services/project.service';
import {TerminalService} from '../../lib/services/terminal.service';

export class BackendTestCommand {
  constructor(
    private projectService: ProjectService,
    private terminalService: TerminalService
  ) {}

  async run() {
    this.terminalService.exec('npm run test', this.projectService.BACKEND_DIR);
  }
}
