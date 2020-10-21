import {green} from 'chalk';
import {textSync} from 'figlet';

import {HelpService} from '../../lib/services/help.service';

interface HelpOptions {
  detail?: boolean;
}

export class HelpCommand {
  constructor(private helpService: HelpService) {}

  run(version: string, cmdOptions: HelpOptions) {
    console.log(
      '\n' +
        textSync('Sheetbase', {horizontalLayout: 'full'}) +
        ` CLI ${version}`
    );
    console.log(
      '\n' +
        ' Usage: ' +
        green('sheetbase <command> [<args>] [--help] [options]')
    );
    if (cmdOptions.detail) {
      console.log(this.helpService.helpDetail());
    } else {
      console.log(this.helpService.help());
    }
  }
}
