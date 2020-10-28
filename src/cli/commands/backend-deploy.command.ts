import {MessageService} from '../../lib/services/message.service';
import {ProjectService} from '../../lib/services/project.service';
import {GoogleService} from '../../lib/services/google.service';
import {GasService} from '../../lib/services/gas.service';

export interface BackendDeployCommandOptions {
  message?: string;
}

export class BackendDeployCommand {
  constructor(
    private messageService: MessageService,
    private projectService: ProjectService,
    private googleService: GoogleService,
    private gasService: GasService
  ) {}

  async run(commandOptions: BackendDeployCommandOptions) {
    // load default google account
    const googleClient = await this.googleService.getDefaultOAuth2Client();
    if (!googleClient) {
      return this.messageService.logError('GOOGLE__ERROR__NO_ACCOUNT');
    }
    // load script id and deployment id
    const {scriptId} = await this.projectService.getClaspConfigs();
    const {backendUrl = ''} = await this.projectService.getFrontendConfigs();
    const deploymentId = backendUrl
      .replace('https://script.google.com/macros/s/', '')
      .replace('/exec', '');
    if (!scriptId || !deploymentId) {
      return this.messageService.logError('BACKEND__ERROR__INVALID');
    }
    // update the web app
    await this.gasService.updateWebapp(
      googleClient,
      scriptId,
      deploymentId,
      undefined,
      commandOptions.message
    );
    // done
    this.messageService.logOk('BACKEND_DEPLOY__OK', true);
  }
}
