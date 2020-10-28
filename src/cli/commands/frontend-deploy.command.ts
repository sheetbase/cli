import {EOL} from 'os';
import {pathExists} from 'fs-extra';

import {MessageService} from '../../lib/services/message.service';
import {
  ProjectService,
  GithubProvider,
  Deployment,
} from '../../lib/services/project.service';
import {TerminalService} from '../../lib/services/terminal.service';

export interface FrontendDeployCommandOptions {
  message?: string;
}

export class FrontendDeployCommand {
  constructor(
    private messageService: MessageService,
    private projectService: ProjectService,
    private terminalService: TerminalService
  ) {}

  async run(commandOptions: FrontendDeployCommandOptions) {
    const {
      deployment = {} as Deployment,
    } = await this.projectService.getSheetbaseJson();
    const {
      provider,
      url = 'n/a',
      stagingDir = './frontend/www-prod',
      destination = {},
    } = deployment;
    const stagingCwd = await this.projectService.getPath(stagingDir);
    // check if dir exists
    if (!(await pathExists(stagingCwd))) {
      return this.messageService.logError('FRONTEND_DEPLOY__ERROR__NO_STAGING');
    }
    // no provider
    if (!provider) {
      return this.messageService.logError(
        'FRONTEND_DEPLOY__ERROR__NO_PROVIDER'
      );
    }
    // deploy
    if (provider === 'github') {
      const {master} = destination as GithubProvider;

      // add
      const addCmd = 'git add .';
      await this.messageService.logAction(addCmd, async () => {
        this.terminalService.exec(addCmd, stagingCwd, 'ignore', true);
      });
      // commit
      const commitCmd =
        'git commit -m ' +
        (commandOptions.message
          ? '"' + commandOptions.message + '"'
          : '"' + new Date().toISOString() + '"');
      await this.messageService.logAction(commitCmd, async () => {
        this.terminalService.exec(commitCmd, stagingCwd, 'ignore', true);
      });
      // push
      const pushCmd = 'git push -f origin ' + (master ? 'master' : 'gh-pages');
      await this.messageService.logAction(pushCmd, async () => {
        this.terminalService.exec(pushCmd, stagingCwd, 'ignore', true);
      });

      // log additional
      if (url.indexOf('.github.io') < 0) {
        this.messageService.logInfo(
          'Remember to set A record, and Enforce HTTPS:' +
            EOL +
            ' + 185.199.108.153' +
            EOL +
            ' + 185.199.109.153' +
            EOL +
            ' + 185.199.110.153' +
            EOL +
            ' + 185.199.111.153'
        );
      }
    }
    // done
    this.messageService.logOk('FRONTEND_DEPLOY__OK', true, [url]);
  }
}
