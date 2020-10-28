import {resolve} from 'path';
import {pathExists, readFile, outputFile, ensureDir, copy} from 'fs-extra';
import * as del from 'del';

import {MessageService} from '../../lib/services/message.service';
import {
  ProjectService,
  GithubProvider,
  Deployment,
} from '../../lib/services/project.service';
import {TerminalService} from '../../lib/services/terminal.service';
import {BuildService} from '../../lib/services/build.service';

export class FrontendBuildCommand {
  constructor(
    private messageService: MessageService,
    private projectService: ProjectService,
    private terminalService: TerminalService,
    private buildService: BuildService
  ) {}

  async run() {
    const {
      deployment = {} as Deployment,
    } = await this.projectService.getSheetbaseJson();
    const {
      provider,
      url = '',
      wwwDir = './frontend/www',
      stagingDir = './frontend/www-prod',
      destination = {},
    } = deployment;
    const {
      gitUrl,
      master, // github
    } = destination as GithubProvider;

    // folders
    const wwwCwd = await this.projectService.getPath(wwwDir);
    const stagingCwd = await this.projectService.getPath(stagingDir);

    // malform provider
    if (!provider || (provider === 'github' && !gitUrl)) {
      return this.messageService.logError(
        'FRONTEND_DEPLOY__ERROR__NO_PROVIDER'
      );
    }

    // build code
    await this.messageService.logAction(
      'Build code (could take several minutes)',
      async () => {
        this.terminalService.exec('npm run build', 'frontend', 'ignore');
      }
    );
    // prepare the staging folder
    await this.messageService.logAction('Prepare the deploy area', async () => {
      if (!(await pathExists(stagingCwd))) {
        // create the folder
        await ensureDir(stagingCwd);
      } else {
        // clean the folder
        await del(
          [
            // delete all files
            stagingCwd + '/**',
            '!' + stagingCwd,
            // except these
            '!' + stagingCwd + '/.git/',
          ],
          {force: true}
        );
      }
      // provider specific preparations
      if (
        provider === 'github' &&
        !(await pathExists(resolve(stagingCwd, '.git')))
      ) {
        // init git
        this.terminalService.exec('git init', stagingCwd, 'ignore', true);
        // set remote
        this.terminalService.exec(
          'git remote add origin ' + gitUrl,
          stagingCwd,
          'ignore',
          true
        );
        // use master or gh-pages
        if (!master) {
          this.terminalService.exec(
            'git checkout -b gh-pages',
            stagingCwd,
            'ignore',
            true
          );
        }
      }
    });
    // copy file to the staging
    await this.messageService.logAction('Copy files', async () => {
      await copy(wwwCwd, stagingCwd);
    });
    // provider specific tweaks
    await this.messageService.logAction('Final touches', async () => {
      if (provider === 'github') {
        const indexHtmlContent = await readFile(
          resolve(stagingCwd, 'index.html'),
          'utf-8'
        );
        const title = (
          indexHtmlContent.match(/<title>(.*)<\/title>/) || []
        ).pop();
        // add 404.html
        await outputFile(
          resolve(stagingCwd, '404.html'),
          this.buildService.github404HtmlContent(url, title)
        );
        // add CNAME
        // only when using custom domain
        if (url.indexOf('.github.io') < 0) {
          await outputFile(
            resolve(stagingCwd, 'CNAME'),
            url.split('/').filter(Boolean)[1]
          );
        }
        // add index.html SPA hack snipet
        // change base if needed
        await outputFile(
          resolve(stagingCwd, 'index.html'),
          this.buildService.prerenderModifier(
            provider,
            indexHtmlContent,
            url,
            true,
            true
          )
        );
      }
    });

    // done
    this.messageService.logOk('FRONTEND_BUILD__OK', true);
  }
}
