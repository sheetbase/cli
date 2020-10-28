import {resolve} from 'path';
import {writeJson, ensureFile} from 'fs-extra';

import {HelperService} from '../../lib/services/helper.service';
import {MessageService} from '../../lib/services/message.service';
import {ProjectService} from '../../lib/services/project.service';

export class ConfigExportCommand {
  constructor(
    private helperService: HelperService,
    private messageService: MessageService,
    private projectService: ProjectService
  ) {}

  async run() {
    // get the path
    const fileName =
      this.helperService.buildValidFileName(
        'configs-exported-' + new Date().toISOString().split('T').shift()
      ) + '.json';
    const savingPath = resolve('__exported__', fileName);
    // export data
    const {configs} = await this.projectService.getSheetbaseJson();
    await ensureFile(savingPath);
    await writeJson(savingPath, configs, {spaces: 3});
    // done
    this.messageService.logOk('PROJECT_CONFIG_EXPORT__OK', true, [savingPath]);
  }
}
