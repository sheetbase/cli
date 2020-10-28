import {MessageService} from '../../lib/services/message.service';
import {ProjectService} from '../../lib/services/project.service';
import {GoogleService} from '../../lib/services/google.service';
import {GasService} from '../../lib/services/gas.service';

export class BackendPushCommand {
  constructor(
    private messageService: MessageService,
    private projectService: ProjectService,
    private googleService: GoogleService,
    private gasService: GasService
  ) {}

  async run() {
    // load default google account
    const googleClient = await this.googleService.getDefaultOAuth2Client();
    if (!googleClient) {
      return this.messageService.logError('GOOGLE__ERROR__NO_ACCOUNT');
    }
    // load script id
    const {scriptId} = await this.projectService.getClaspConfigs();
    if (!scriptId) {
      return this.messageService.logError('BACKEND__ERROR__INVALID');
    }
    // push files
    const result = await this.gasService.push(googleClient, scriptId);
    // done
    this.messageService.logOk('BACKEND_PUSH__OK', true, [result]);
  }
}
