import {ProjectService} from '../../lib/services/project.service';
import {TerminalService} from '../../lib/services/terminal.service';

export class BackendBuildCommand {
  constructor(
    private projectService: ProjectService,
    private terminalService: TerminalService
  ) {}

  async run() {
    this.terminalService.exec('npm run build', this.projectService.BACKEND_DIR);
  }
}
