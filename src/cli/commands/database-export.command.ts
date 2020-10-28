import {resolve} from 'path';
import {ensureFile, writeJson} from 'fs-extra';

import {HelperService} from '../../lib/services/helper.service';
import {MessageService} from '../../lib/services/message.service';
import {GoogleService} from '../../lib/services/google.service';
import {SpreadsheetService} from '../../lib/services/spreadsheet.service';
import {ProjectService} from '../../lib/services/project.service';

export interface DatabaseExportCommandOptions {
  id?: string;
}

export class DatabaseExportCommand {
  constructor(
    private helperService: HelperService,
    private messageService: MessageService,
    private googleService: GoogleService,
    private spreadsheetService: SpreadsheetService,
    private projectService: ProjectService
  ) {}

  async run(
    tableName: string,
    customDir: string,
    commandOptions: DatabaseExportCommandOptions
  ) {
    const isValidProject = await this.projectService.isValid();
    // no table name
    if (!tableName) {
      return this.messageService.logError('DATABASE__ERROR__NO_TABLE');
    }
    // load default google account
    const googleClient = await this.googleService.getDefaultOAuth2Client();
    if (!googleClient) {
      return this.messageService.logError('GOOGLE__ERROR__NO_ACCOUNT');
    }
    // get databaseId
    let databaseId = commandOptions.id;
    if (!databaseId && isValidProject) {
      const {
        backend = {},
        frontend = {},
      } = await this.projectService.getConfigs();
      databaseId = (backend.databaseId || frontend.databaseId) as string;
    }
    if (!databaseId) {
      return this.messageService.logError('DATABASE__ERROR__NO_DATABASE');
    }
    // saving location
    const dir = customDir
      ? customDir // custom
      : !isValidProject // default
      ? `sheetbase_db_${databaseId}` // outside a project
      : '__exported__'; // inside a project
    const fileName =
      this.helperService.buildValidFileName(
        'data-' + tableName + '-exported-' + new Date().toISOString()
      ) + '.json';
    const savingPath = resolve(dir, fileName);
    // save the file
    await ensureFile(savingPath);
    await writeJson(
      savingPath,
      await this.spreadsheetService.getRawData(
        googleClient,
        databaseId,
        tableName
      )
    );
    // done
    this.messageService.logOk('DATABASE_EXPORT__OK', true, [savingPath]);
  }
}
