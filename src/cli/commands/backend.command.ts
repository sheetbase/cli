import {BackendLintCommand} from './backend-lint.command';
import {BackendTestCommand} from './backend-test.command';
import {BackendBuildCommand} from './backend-build.command';
import {BackendPushCommand} from './backend-push.command';
import {
  BackendDeployCommand,
  BackendDeployCommandOptions,
} from './backend-deploy.command';
import {BackendInstallCommand} from './backend-install.command';
import {BackendUninstallCommand} from './backend-uninstall.command';
import {BackendRunCommand} from './backend-run.command';
import {BackendUnknownCommand} from './backend-unknown.command';

type BackendCommandOptions = BackendDeployCommandOptions;

export class BackendCommand {
  constructor(
    private backendLintCommand: BackendLintCommand,
    private backendTestCommand: BackendTestCommand,
    private backendBuildCommand: BackendBuildCommand,
    private backendPushCommand: BackendPushCommand,
    private backendDeployCommand: BackendDeployCommand,
    private backendInstallCommand: BackendInstallCommand,
    private backendUninstallCommand: BackendUninstallCommand,
    private backendRunCommand: BackendRunCommand,
    private backendUnknownCommand: BackendUnknownCommand
  ) {}

  run(
    subCommand: string,
    params: string[],
    commandOptions: BackendCommandOptions
  ) {
    switch (subCommand) {
      case 'lint':
        this.backendLintCommand.run();
        break;
      case 'test':
        this.backendTestCommand.run();
        break;
      case 'build':
        this.backendBuildCommand.run();
        break;
      case 'push':
        this.backendPushCommand.run();
        break;
      case 'deploy':
        this.backendDeployCommand.run(commandOptions);
        break;
      case 'install':
      case 'i':
        this.backendInstallCommand.run();
        break;
      case 'uninstall':
      case 'un':
        this.backendUninstallCommand.run();
        break;
      case 'run':
        this.backendRunCommand.run();
        break;
      default:
        this.backendUnknownCommand.run();
        break;
    }
  }
}
