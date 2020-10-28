const open = require('open');

import {MessageService} from '../../lib/services/message.service';
import {ProjectService} from '../../lib/services/project.service';

export interface ProjectUrlCommandOptions {
  open?: boolean;
}

export class ProjectUrlCommand {
  constructor(
    private messageService: MessageService,
    private projectService: ProjectService
  ) {}

  async run(urlName: string, commandOptions: ProjectUrlCommandOptions) {
    const urls = await this.projectService.buildUrls();
    const link = urls[urlName];

    if (commandOptions.open) {
      this.messageService.logInfo('APP__INFO__LINK_OPENED', false, [link]);
      return open(link);
    } else {
      this.messageService.logOk('PROJECT_URL__OK', true, [urlName, link]);
    }
  }
}
