import {basename} from 'path';
import {capitalCase} from 'change-case';

import {MessageService} from '../../lib/services/message.service';
import {ProjectService} from '../../lib/services/project.service';
import {GoogleService} from '../../lib/services/google.service';
import {DriveService} from '../../lib/services/drive.service';
import {GasService} from '../../lib/services/gas.service';

import {BuiltinHook} from '../hooks/builtin.hook';

export interface ProjectSetupCommandOptions {
  fresh?: boolean;
}

export class ProjectSetupCommand {
  constructor(
    private messageService: MessageService,
    private projectService: ProjectService,
    private googleService: GoogleService,
    private driveService: DriveService,
    private gasService: GasService
  ) {}

  async run(commandOptions: ProjectSetupCommandOptions) {
    const name = basename(process.cwd());
    const namePretty = capitalCase(name);

    // load default google account
    const googleClient = await this.googleService.getDefaultOAuth2Client();
    if (!googleClient) {
      return this.messageService.logError(
        'PROJECT_SETUP__ERROR__NO_GOOGLE_ACCOUNT',
        true,
        [name]
      );
    }

    // clear configs
    if (commandOptions.fresh) {
      await this.messageService.logAction('Reset configs', async () => {
        await this.projectService.resetConfigs(name);
      });
    }

    // load current configs
    let {scriptId} = await this.projectService.getClaspConfigs();
    const projectConfigs = await this.projectService.getSheetbaseJson();
    const {backend = {}, frontend = {}} = projectConfigs.configs || {};

    // drive folder
    let projectId = projectConfigs.projectId;
    if (!projectId) {
      await this.messageService.logAction(
        'Create the Drive folder',
        async () => {
          projectId = await this.driveService.createFolder(
            googleClient,
            `Sheetbase: ${namePretty}`
          );
          await this.projectService.setSheetbaseJson({projectId});
        }
      );
    }

    // backend
    let backendUrl = frontend.backendUrl;
    if (!scriptId) {
      await this.messageService.logAction(
        'Create the backend script',
        async () => {
          scriptId = await this.gasService.create(
            googleClient,
            `${namePretty} Backend`,
            projectId
          );
          await this.projectService.setClaspConfigs({scriptId}, true);
        }
      );
      // deploy backend
      if (!backendUrl) {
        await this.messageService.logAction(
          'Initial deploy the backend',
          async () => {
            const url = await this.gasService.initWebApp(
              googleClient,
              scriptId
            );
            backendUrl = url;
            await this.projectService.setConfigs({backendUrl});
          }
        );
      }
    }

    // hooks
    const setupHooks = projectConfigs.setupHooks;
    if (setupHooks) {
      const builtinHooks = new BuiltinHook(this.driveService, {
        googleClient,
        projectId: projectId as string,
        projectName: name,
      });
      const newConfigs = {} as Record<string, unknown>;
      for (const key of Object.keys(setupHooks)) {
        if (!backend[key] && !frontend[key]) {
          // not exists in configs
          const [description, hookName, ...args] = setupHooks[key];
          await this.messageService.logAction(
            description as string,
            async () => {
              try {
                newConfigs[key] = await ((builtinHooks as unknown) as Record<
                  string,
                  Function
                >)[hookName as string](...args);
              } catch (error) {
                this.messageService.logWarn(
                  'PROJECT_SETUP__WARN__HOOK_ERROR',
                  false,
                  [error]
                );
              }
            }
          );
        }
      }
      await this.projectService.setConfigs(newConfigs);
    }

    // done
    this.messageService.logOk('PROJECT_SETUP__OK', true);
  }
}
