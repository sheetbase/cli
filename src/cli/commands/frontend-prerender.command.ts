import {resolve} from 'path';
import {EOL} from 'os';
import {pathExists, copy, outputFile} from 'fs-extra';
import {blue, gray} from 'chalk';
import {launch} from 'puppeteer-core';
const superstatic = require('superstatic');

import {MessageService} from '../../lib/services/message.service';
import {ProjectService, Deployment} from '../../lib/services/project.service';
import {FileService} from '../../lib/services/file.service';
import {GoogleService} from '../../lib/services/google.service';
import {
  BuildService,
  PrerenderItem,
  LoadingScreen,
} from '../../lib/services/build.service';

export interface FrontendPrerenderCommandOptions {
  only?: string;
  force?: string;
}

export class FrontendPrerenderCommand {
  constructor(
    private messageService: MessageService,
    private projectService: ProjectService,
    private fileService: FileService,
    private googleService: GoogleService,
    private buildService: BuildService
  ) {}

  async run(commandOptions: FrontendPrerenderCommandOptions) {
    const {
      deployment = {} as Deployment,
    } = await this.projectService.getSheetbaseJson();
    const {
      provider,
      url = '',
      wwwDir = './frontend/www',
      stagingDir = './frontend/www-prod',
    } = deployment;

    // folders
    const wwwCwd = await this.projectService.getPath(wwwDir);
    const stagingCwd = await this.projectService.getPath(stagingDir);

    // check if dir exists
    if (!(await pathExists(stagingCwd))) {
      return this.messageService.logError('FRONTEND_DEPLOY__ERROR__NO_STAGING');
    }

    // load default google account
    const googleClient = await this.googleService.getDefaultOAuth2Client();
    if (!googleClient) {
      return this.messageService.logError('GOOGLE__ERROR__NO_ACCOUNT');
    }

    // get databaseId
    const {databaseId} = await this.projectService.getBackendConfigs();
    if (!databaseId) {
      return this.messageService.logError(
        'FRONTEND_DEPLOY__ERROR__NO_DATABASE'
      );
    }

    // load data
    let prerenderItems: Array<PrerenderItem | string>;
    let prerenderLoading: boolean | LoadingScreen;
    await this.messageService.logAction('Load prerender items', async () => {
      const {items, loading} = await this.buildService.loadPrerendering(
        googleClient,
        databaseId as string
      );
      prerenderItems = items;
      prerenderLoading = loading;
    });

    // server & browser
    const server = await superstatic
      .server({
        port: 7777,
        host: 'localhost',
        cwd: wwwCwd,
        config: {
          rewrites: [{source: '**', destination: '/index.html'}],
          cleanUrls: true,
        },
        debug: false,
      })
      .listen();
    // browser
    const browser = await launch({
      executablePath:
        process.env.GOOGLE_CHROME ||
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    });

    await this.messageService.logAction('Prerender:', async () => {
      // only checker
      const onlyChecker = (path: string) => {
        let only = false;
        // check
        const onlyItems: string[] = (commandOptions.only || '')
          .split(',')
          .filter(Boolean);
        for (let i = 0; i < onlyItems.length; i++) {
          const onlyItem = onlyItems[i];
          if (path.indexOf(onlyItem) > -1) {
            only = true;
            break;
          }
        }
        return only;
      };
      // force checker
      const forcedChecker = (path: string) => {
        let forced = false;
        // check
        const forcedItems: string[] = (commandOptions.force || '')
          .split(',')
          .filter(Boolean);
        for (let i = 0; i < forcedItems.length; i++) {
          const forcedItem = forcedItems[i];
          if (path.indexOf(forcedItem) > -1) {
            forced = true;
            break;
          }
        }
        return forced;
      };
      // expired checker
      const expiredChecker = (prerenderPath: string) => {
        const nowTime = new Date().getTime();
        const modifiedTime = this.fileService
          .getModifiedTime(prerenderPath)
          .getTime();
        return nowTime - modifiedTime > 604800000; // a week
      };
      // counter
      const countTotal = prerenderItems.length;
      let countDone = 0;
      let countSkipped = 0;
      let countForced = 0;
      let countExpired = 0;
      // process items
      for (let i = 0; i < prerenderItems.length; i++) {
        const item = prerenderItems[i];
        const path = typeof item === 'string' ? item : item.path;
        const prerenderPath = resolve(stagingCwd, path, 'index.html');
        // prerender:
        // 1. only
        // 2. regular, when:
        // always /
        // not exists (new)
        // forced
        // expired
        // process

        let isOnly = false;
        let isForced = false;
        let isExpired = false;
        if (path) {
          // only
          isOnly = onlyChecker(path);
          // forced
          isForced = forcedChecker(path);
          if (isForced) {
            countForced++;
          }
          // expired
          if (await pathExists(prerenderPath)) {
            isExpired = expiredChecker(prerenderPath);
            if (isExpired) {
              countExpired++;
            }
          }
        }
        // process
        if (
          // only
          (!!commandOptions.only && isOnly) ||
          // regular
          (!commandOptions.only &&
            // always /
            (!path ||
              // not exists (new)
              (!!path && !(await pathExists(prerenderPath))) ||
              // force (*)
              commandOptions.force === '*' ||
              // forced (custom)
              isForced ||
              // expired
              isExpired))
        ) {
          const page = await browser.newPage();
          await page.goto('http://localhost:7777/' + path, {
            waitUntil: 'networkidle0',
            timeout: 1000000,
          });
          const content = this.buildService.prerenderModifier(
            provider,
            await page.content(),
            url,
            prerenderLoading,
            !path
          );
          await outputFile(prerenderPath, content);
          await page.close();
          // log item
          const status =
            isForced || isExpired ? (isExpired ? 'expired' : 'forced') : null;
          console.log(
            '   + ' + (path || '/') + blue(status ? ` (${status})` : '')
          );
          // count done
          countDone++;
        } else {
          console.log('   + ' + path + gray(' (skipped)'));
          countSkipped++;
        }
      }
      // log counters
      // tslint:disable-next-line:max-line-length
      console.log(
        EOL +
          `   Total: ${countTotal} | Done: ${countDone} | Skipped: ${countSkipped} | Forced: ${countForced} | Expired: ${countExpired}`
      );
    });

    // shutdown
    await browser.close();
    await server.close();

    // sitemap
    let sitemap = '';
    await this.messageService.logAction('Generate sitemap.xml', async () => {
      for (let i = 0; i < prerenderItems.length; i++) {
        let item = prerenderItems[i];
        if (typeof item === 'string') {
          item = {
            path: item,
            changefreq: !item ? 'daily' : 'monthly',
            priority: !item ? '1.0' : '0.5',
          };
        }
        const {path, changefreq, priority} = item;
        let remoteUrl = url + '/' + path;
        remoteUrl = remoteUrl.substr(-1) === '/' ? remoteUrl : remoteUrl + '/';
        const lastmod = new Date().toISOString().substr(0, 10);
        // add to sitemap
        sitemap +=
          '   <url>' +
          EOL +
          '       <loc>' +
          remoteUrl +
          '</loc>' +
          EOL +
          '       <lastmod>' +
          lastmod +
          '</lastmod>' +
          EOL +
          '       <changefreq>' +
          changefreq +
          '</changefreq>' +
          EOL +
          '       <priority>' +
          priority +
          '</priority>' +
          EOL +
          '   </url>' +
          EOL;
      }
      await outputFile(
        resolve(stagingCwd, 'sitemap.xml'),
        '<?xml version="1.0" encoding="UTF-8"?>' +
          EOL +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
          EOL +
          sitemap +
          EOL +
          '</urlset>'
      );
    });

    // robots
    await this.messageService.logAction('Save robots.txt', async () => {
      const robotsSourcePath = resolve('.', 'robots.txt');
      const robotsDestPath = resolve(stagingCwd, 'robots.txt');
      if (await pathExists(robotsSourcePath)) {
        await copy(robotsSourcePath, robotsDestPath); // copy
      } else {
        // save new file
        await outputFile(robotsDestPath, 'User-agent: *' + EOL + 'Disallow:');
      }
    });

    // done
    this.messageService.logOk('FRONTEND_PRERENDER__OK', true);
  }
}
