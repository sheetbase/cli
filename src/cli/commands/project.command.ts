import {MessageService} from '../../lib/services/message.service';
import {HelpService} from '../../lib/services/help.service';

import {
  ProjectSetupCommand,
  ProjectSetupCommandOptions,
} from './project-setup.command';
import {ProjectConfigsCommand} from './project-configs.command';
import {ProjectUrlsCommand} from './project-urls.command';
import {
  ProjectUrlCommand,
  ProjectUrlCommandOptions,
} from './project-url.command';
import {ProjectInfoCommand} from './project-info.command';
import {ProjectLintCommand} from './project-lint.command';
import {ProjectTestCommand} from './project-test.command';
import {ProjectBuildCommand} from './project-build.command';
import {ProjectPreviewCommand} from './project-preview.command';
import {
  ProjectDeployCommand,
  ProjectDeployCommandOptions,
} from './project-deploy.command';

interface ProjectCommandOptions
  extends ProjectSetupCommandOptions,
    ProjectUrlCommandOptions,
    ProjectDeployCommandOptions {}

export class ProjectCommand {
  constructor(
    private messageService: MessageService,
    private helpService: HelpService,
    private projectSetupCommand: ProjectSetupCommand,
    private projectConfigsCommand: ProjectConfigsCommand,
    private projectUrlsCommand: ProjectUrlsCommand,
    private projectUrlCommand: ProjectUrlCommand,
    private projectInfoCommand: ProjectInfoCommand,
    private projectLintCommand: ProjectLintCommand,
    private projectTestCommand: ProjectTestCommand,
    private projectBuildCommand: ProjectBuildCommand,
    private projectPreviewCommand: ProjectPreviewCommand,
    private projectDeployCommand: ProjectDeployCommand
  ) {}

  run(
    subCommand: string,
    params: string[],
    commandOptions: ProjectCommandOptions
  ) {
    switch (subCommand) {
      case 'setup':
        this.projectSetupCommand.run(commandOptions);
        break;
      case 'configs':
        this.projectConfigsCommand.run();
        break;
      case 'urls':
        this.projectUrlsCommand.run();
        break;
      case 'url':
        this.projectUrlCommand.run(params[0], commandOptions);
        break;
      case 'info':
        this.projectInfoCommand.run();
        break;
      case 'lint':
        this.projectLintCommand.run();
        break;
      case 'test':
        this.projectTestCommand.run();
        break;
      case 'build':
        this.projectBuildCommand.run();
        break;
      case 'deploy':
        this.projectDeployCommand.run(commandOptions);
        break;
      case 'preview':
        this.projectPreviewCommand.run();
        break;
      default:
        this.messageService.logInfo('APP__INFO__INVALID_SUBCOMMAND', false, [
          'project',
        ]);
        console.log(this.helpService.projectHelp());
        break;
    }
  }
}
