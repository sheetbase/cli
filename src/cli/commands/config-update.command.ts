import {HelperService} from '../../lib/services/helper.service';
import {MessageService} from '../../lib/services/message.service';
import {ProjectService} from '../../lib/services/project.service';

export class ConfigUpdateCommand {
  constructor(
    private helperService: HelperService,
    private messageService: MessageService,
    private projectService: ProjectService
  ) {}

  async run(input: string[]) {
    // set configs
    if (!!input && input.length > 0) {
      await this.projectService.setConfigs(
        this.helperService.buildKeyValueFromParams(input)
      );
    }
    // update configs
    else {
      // load configs from sheetbase.json
      const {
        backend = {},
        frontend = {},
      } = await this.projectService.getConfigs();
      await this.projectService.setBackendConfigs(backend);
      await this.projectService.setFrontendConfigs(frontend);
    }
    // done
    this.messageService.logOk('PROJECT_CONFIG_UPDATE__OK', true);
  }
}
