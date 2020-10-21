import {green, yellow, magenta} from 'chalk';
const ttyTable = require('tty-table');
const config = require('configstore');
import axios from 'axios';

import {TerminalService} from '../../lib/services/terminal.service';

interface UpdateOptions {
  yes?: boolean;
}

export class UpdateCommand {
  private configstore = new config('sheetbase_cli');

  constructor(private terminalService: TerminalService) {}

  async run(version: string, cmdOptions: UpdateOptions) {
    const {
      hasUpdate,
      currentVersion,
      latestVersion,
    } = await this.getUpdateStatus(version);
    if (!hasUpdate) {
      console.log('\n Up to date :)');
    } else {
      if (!cmdOptions.yes) {
        this.logUpdateMessage(currentVersion, latestVersion);
      } else {
        console.log('New version available, start updating now.');
        this.terminalService.exec('npm install -g @sheetbase/cli@latest');
      }
    }
  }

  async checkUpdate(version: string) {
    const {
      hasUpdate,
      currentVersion,
      latestVersion,
    } = await this.getUpdateStatus(version);
    const now = new Date().getTime();
    const latestCheck = this.configstore.get('latest_update_check');
    const beenHours = latestCheck
      ? Math.round((now - latestCheck) / 3600000)
      : 24;
    if (beenHours >= 24 && !!hasUpdate) {
      console.log('\n');
      this.logUpdateMessage(currentVersion, latestVersion);
      console.log('\n');
      this.configstore.set('latest_update_check', now);
    }
  }

  async getUpdateStatus(version: string) {
    const {
      data: {latest},
    } = await axios({
      method: 'GET',
      url: 'https://registry.npmjs.org/-/package/@sheetbase/cli/dist-tags',
    });
    return {
      hasUpdate: latest !== version,
      currentVersion: version,
      latestVersion: latest,
    };
  }

  logUpdateMessage(from: string, to: string) {
    const table = ttyTable(
      [{value: 'Update available!', headerAlign: 'left', align: 'left'}],
      [
        [
          'The @sheetbase/cli got a new version ' +
            yellow(from) +
            ' -> ' +
            green(to),
        ],
        ['Update: ' + magenta('npm install -g @sheetbase/cli@latest')],
      ],
      {compact: true}
    );
    console.log(table.render());
  }
}
