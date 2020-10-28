import {resolve} from 'path';
import {pathExists, readJson} from 'fs-extra';

import {MessageService} from '../../lib/services/message.service';
import {ProjectService} from '../../lib/services/project.service';

export class ConfigImportCommand {
  constructor(
    private messageService: MessageService,
    private projectService: ProjectService
  ) {}

  async run(filePath: string) {
    // load data
    if (!filePath || !(await pathExists(filePath))) {
      return this.messageService.logError(
        'PROJECT_CONFIG_IMPORT__ERROR__NO_FILE'
      );
    }
    // set data
    const {backend = {}, frontend = {}} = await readJson(resolve(filePath));
    await this.projectService.setBackendConfigs(backend);
    await this.projectService.setFrontendConfigs(frontend);
    // done
    this.messageService.logOk('PROJECT_CONFIG_IMPORT__OK', true);
  }
}
