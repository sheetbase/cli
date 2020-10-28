import {MessageService} from '../../lib/services/message.service';

import {BackendBuildCommand} from './backend-build.command';
import {FrontendBuildCommand} from './frontend-build.command';
import {FrontendPrerenderCommand} from './frontend-prerender.command';

export class ProjectBuildCommand {
  constructor(
    private messageService: MessageService,
    private backendBuildCommand: BackendBuildCommand,
    private frontendBuildCommand: FrontendBuildCommand,
    private frontendPrerenderCommand: FrontendPrerenderCommand
  ) {}

  async run() {
    await this.backendBuildCommand.run();
    await this.frontendBuildCommand.run();
    await this.frontendPrerenderCommand.run({});
    // done
    this.messageService.logOk('PROJECT_BUILD__OK', true);
  }
}
