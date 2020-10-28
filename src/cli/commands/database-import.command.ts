import {resolve} from 'path';
import {readJson} from 'fs-extra';

import {HelperService} from '../../lib/services/helper.service';
import {MessageService} from '../../lib/services/message.service';
import {GoogleService} from '../../lib/services/google.service';
import {SpreadsheetService} from '../../lib/services/spreadsheet.service';
import {ProjectService} from '../../lib/services/project.service';
import {ModelService} from '../../lib/services/model.service';
import {FetchService} from '../../lib/services/fetch.service';

export interface DatabaseImportCommandOptions {
  id?: string;
}

export class DatabaseImportCommand {
  constructor(
    private helperService: HelperService,
    private messageService: MessageService,
    private googleService: GoogleService,
    private spreadsheetService: SpreadsheetService,
    private projectService: ProjectService,
    private modelService: ModelService,
    private fetchService: FetchService
  ) {}

  async run(
    tableName: string,
    inputSource: string,
    commandOptions: DatabaseImportCommandOptions
  ) {
    let source = inputSource || tableName;
    const isValidProject = await this.projectService.isValid();
    // no table name
    if (!tableName) {
      return this.messageService.logError('DATABASE__ERROR__NO_TABLE');
    }
    // no import source
    if (!source) {
      return this.messageService.logError('DATABASE_IMPORT__ERROR__NO_SOURCE');
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
    // get built-in model
    if (source.indexOf('.json') < 0) {
      const version = isValidProject
        ? await this.modelService.getModelsPackageVersion()
        : 'latest';
      source = `https://unpkg.com/@sheetbase/models@${version}/data/${source}.json`;
    }
    // get values
    let values = [];
    if (this.helperService.isUrl(source)) {
      values = await this.fetchService.get(source);
    } else {
      source = resolve(
        source.replace(/\\/g, '/') // replace Windows \
      );
      values = await readJson(source);
    }

    // refine and checking the values
    if (!!values && !!values[0] && values[0][0] === '#') {
      values.shift(); // remove the header
    }
    if (!values || !values.length) {
      return this.messageService.logError(
        'DATABASE_IMPORT__ERROR__NO_DATA',
        true,
        [source]
      );
    }
    // import the values
    await this.spreadsheetService.addData(
      googleClient,
      databaseId,
      tableName,
      values
    );
    // done
    this.messageService.logOk('DATABASE_IMPORT__OK', true, [tableName, source]);
  }
}
