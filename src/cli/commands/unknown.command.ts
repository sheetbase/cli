import {TerminalService} from '../../lib/services/terminal.service';

export class UnknownCommand {
  constructor(private terminalService: TerminalService) {}

  run(name: string) {
    this.terminalService.exec('npm run ' + name);
  }
}
