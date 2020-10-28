import {green} from 'chalk';
const ttyTable = require('tty-table');

import {MessageService} from '../../lib/services/message.service';
import {ProjectService} from '../../lib/services/project.service';

export class ProjectUrlsCommand {
  constructor(
    private messageService: MessageService,
    private projectService: ProjectService
  ) {}

  async run() {
    // build urls
    const urls = await this.projectService.buildUrls();
    // print out result
    const table = ttyTable(
      [
        {value: 'Name', width: 100, align: 'left'},
        {value: 'Value', width: 500, align: 'left'},
      ],
      []
    );
    for (const key of Object.keys(urls)) {
      table.push([key, green(urls[key] || 'n/a')]);
    }
    console.log(table.render());
    // done
    this.messageService.logOk('PROJECT_URLS__OK', true);
  }
}
