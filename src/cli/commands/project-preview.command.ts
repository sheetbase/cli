const superstatic = require('superstatic');

import {MessageService} from '../../lib/services/message.service';
import {ProjectService, Deployment} from '../../lib/services/project.service';

export class ProjectPreviewCommand {
  constructor(
    private messageService: MessageService,
    private projectService: ProjectService
  ) {}

  async run() {
    const {
      deployment = {} as Deployment,
    } = await this.projectService.getSheetbaseJson();
    const {wwwDir = './frontend/www'} = deployment;
    const wwwCwd = await this.projectService.getPath(wwwDir);
    // launch server
    superstatic
      .server({
        port: 7777,
        host: 'localhost',
        cwd: wwwCwd,
        config: {
          rewrites: [{source: '**', destination: '/index.html'}],
          cleanUrls: true,
        },
        debug: true,
      })
      .listen(() =>
        this.messageService.logInfo('See your app at: http://localhost:7777')
      );
  }
}
