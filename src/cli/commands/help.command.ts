import {green} from 'chalk';
import {textSync} from 'figlet';

import {HelpService} from '../../lib/services/help.service';

interface HelpCommandOptions {
  detail?: boolean;
}

export class HelpCommand {
  constructor(private helpService: HelpService) {}

  run(version: string, commandOptions: HelpCommandOptions) {
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
    if (commandOptions.detail) {
      console.log(this.helpService.helpDetail());
    } else {
      console.log(this.helpService.help());
    }
  }
}
