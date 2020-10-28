import {MessageService} from '../../lib/services/message.service';

import {BackendDeployCommand} from './backend-deploy.command';
import {FrontendDeployCommand} from './frontend-deploy.command';

export interface ProjectDeployCommandOptions {
  message?: string;
}

export class ProjectDeployCommand {
  constructor(
    private messageService: MessageService,
    private backendDeployCommand: BackendDeployCommand,
    private frontendDeployCommand: FrontendDeployCommand
  ) {}

  async run(commandOptions: ProjectDeployCommandOptions) {
    await this.backendDeployCommand.run(commandOptions);
    await this.frontendDeployCommand.run(commandOptions);
    // done
    this.messageService.logOk('PROJECT_DEPLOY__OK', true);
  }
}
