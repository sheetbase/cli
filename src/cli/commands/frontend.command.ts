import {FrontendLintCommand} from './frontend-lint.command';
import {FrontendTestCommand} from './frontend-test.command';
import {FrontendBuildCommand} from './frontend-build.command';
import {
  FrontendPrerenderCommand,
  FrontendPrerenderCommandOptions,
} from './frontend-prerender.command';
import {
  FrontendDeployCommand,
  FrontendDeployCommandOptions,
} from './frontend-deploy.command';
import {FrontendInstallCommand} from './frontend-install.command';
import {FrontendUninstallCommand} from './frontend-uninstall.command';
import {FrontendRunCommand} from './frontend-run.command';
import {FrontendUnknownCommand} from './frontend-unknown.command';

interface FrontendCommandOptions
  extends FrontendPrerenderCommandOptions,
    FrontendDeployCommandOptions {}

export class FrontendCommand {
  constructor(
    private frontendLintCommand: FrontendLintCommand,
    private frontendTestCommand: FrontendTestCommand,
    private frontendBuildCommand: FrontendBuildCommand,
    private frontendPrerenderCommand: FrontendPrerenderCommand,
    private frontendDeployCommand: FrontendDeployCommand,
    private frontendInstallCommand: FrontendInstallCommand,
    private frontendUninstallCommand: FrontendUninstallCommand,
    private frontendRunCommand: FrontendRunCommand,
    private frontendUnknownCommand: FrontendUnknownCommand
  ) {}

  run(
    subCommand: string,
    params: string[],
    commandOptions: FrontendCommandOptions
  ) {
    switch (subCommand) {
      case 'lint':
        this.frontendLintCommand.run();
        break;
      case 'test':
        this.frontendTestCommand.run();
        break;
      case 'build':
        this.frontendBuildCommand.run();
        break;
      case 'prerender':
        this.frontendPrerenderCommand.run(commandOptions);
        break;
      case 'deploy':
        this.frontendDeployCommand.run(commandOptions);
        break;
      case 'install':
      case 'i':
        this.frontendInstallCommand.run();
        break;
      case 'uninstall':
      case 'un':
        this.frontendUninstallCommand.run();
        break;
      case 'run':
        this.frontendRunCommand.run();
        break;
      default:
        this.frontendUnknownCommand.run();
        break;
    }
  }
}
