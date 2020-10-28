import {MessageService} from '../../lib/services/message.service';
import {GoogleService} from '../../lib/services/google.service';

export class GoogleActiveCommand {
  constructor(
    private messageService: MessageService,
    private googleService: GoogleService
  ) {}

  async run(id: string) {
    await this.googleService.setDefaultAccountId(id);
    this.messageService.logOk('GOOGLE_DEFAULT__OK', true, [id]);
  }
}
