import {resolve} from 'path';
import {pathExists, remove} from 'fs-extra';

import {HelperService} from '../../lib/services/helper.service';
import {MessageService} from '../../lib/services/message.service';
import {ProjectService} from '../../lib/services/project.service';
import {FileService} from '../../lib/services/file.service';
import {FetchService} from '../../lib/services/fetch.service';
import {TerminalService} from '../../lib/services/terminal.service';

interface NewCommandOptions {
  skipInstall?: boolean;
  skipSetup?: boolean;
}

export class NewCommand {
  constructor(
    private helperService: HelperService,
    private messageService: MessageService,
    private projectService: ProjectService,
    private fileService: FileService,
    private fetchService: FetchService,
    private terminalService: TerminalService
  ) {}

  async run(name: string, source: string, commandOptions: NewCommandOptions) {
    // project name and path
    name = this.helperService.buildValidFileName(name);
    const deployPath = resolve(name);
    // check if a project exists
    if (await pathExists(name)) {
      return this.messageService.logError('PROJECT__ERROR__EXISTS');
    }
    // prepare the resource url
    const url = this.resolveResource(source);
    if (!url || (!url.endsWith('.git') && !url.endsWith('.zip'))) {
      return this.messageService.logError(
        'PROJECT_START__ERROR__INVALID_RESOURCE'
      );
    }
    // project files
    await this.messageService.logAction(
      'Get the resource from ' + url,
      async () => {
        if (url.endsWith('.git')) {
          // clone the repo when has .git url
          this.terminalService.exec(
            `git clone ${url} ${name}`,
            '.',
            'ignore',
            true
          );
          await remove(deployPath + '/' + '.git'); // delete .git folder
        } else {
          const downloadedPath = await this.fetchService.download(
            url,
            deployPath,
            'resource.zip'
          );
          await this.fileService.unzip(downloadedPath, deployPath);
          await remove(downloadedPath);
          await this.fileService.unwrap(deployPath); // if wrapped in a folder
        }
      }
    );
    // finalize for theme
    if (await pathExists(deployPath + '/sheetbase.json')) {
      // run setup
      if (!commandOptions.skipSetup) {
        this.terminalService.exec('sheetbase setup --fresh', deployPath);
      }
      // create models
      const {
        backend = {},
        frontend = {},
      } = await this.projectService.getConfigs(deployPath);
      const databaseId = (backend.databaseId || frontend.databaseId) as string;
      if (databaseId) {
        this.terminalService.exec('sheetbase db create * --data', deployPath);
      }
      // install packages
      if (!commandOptions.skipInstall) {
        await this.messageService.logAction(
          'Install backend dependencies',
          async () =>
            this.terminalService.exec('npm install', deployPath + '/backend')
        );
        await this.messageService.logAction(
          'Install frontend dependencies',
          async () =>
            this.terminalService.exec('npm install', deployPath + '/frontend')
        );
      }
      this.messageService.logOk('PROJECT_START__OK__THEME', true, [
        name,
        commandOptions,
      ]);
    } else {
      // install packages
      if (!commandOptions.skipInstall) {
        await this.messageService.logAction('Install dependencies', async () =>
          this.terminalService.exec('npm install', deployPath)
        );
      }
      this.messageService.logOk('PROJECT_START__OK__NOT_THEME', true, [
        name,
        commandOptions,
      ]);
    }
  }

  resolveResource(resource?: string) {
    /**
     * n/a > starter@latest
     * name > name@latest
     * name@ver > name@ver
     * <name>/<repo>@ver
     * full zip url > full zip url
     */
    resource = (resource || 'sheetbase-themes/starter').replace('@latest', '');
    if (!resource.endsWith('.git') && !resource.endsWith('.zip')) {
      // add repo org
      if (resource.indexOf('/') < 0) {
        resource = 'sheetbase-themes/' + resource;
      }
      // add version
      if (resource.indexOf('@') < 0) {
        resource = resource + '@latest';
      }
      // final resource = <org>/<repo>@<version>
      const [name, version] = resource.split('@');
      resource = `https://github.com/${name}/archive/${version}.zip`;
    }
    return resource;
  }
}
