import {HelperService} from '../../lib/services/helper.service';
import {MessageService} from '../../lib/services/message.service';
import {GoogleService} from '../../lib/services/google.service';
import {SpreadsheetService} from '../../lib/services/spreadsheet.service';
import {ProjectService} from '../../lib/services/project.service';
import {ModelService, Model} from '../../lib/services/model.service';
import {FetchService} from '../../lib/services/fetch.service';

export interface DatabaseCreateCommandOptions {
  id?: string;
  data?: boolean;
}

export class DatabaseCreateCommand {
  constructor(
    private helperService: HelperService,
    private messageService: MessageService,
    private googleService: GoogleService,
    private spreadsheetService: SpreadsheetService,
    private projectService: ProjectService,
    private modelService: ModelService,
    private fetchService: FetchService
  ) {}

  async run(input: string[], commandOptions: DatabaseCreateCommandOptions) {
    const isValidProject = await this.projectService.isValid();
    // require input (outside a project & no custom)
    if (
      !isValidProject && // outside
      (!input.length || input[0] === '*') // no custom
    ) {
      return this.messageService.logError('DATABASE_CREATE__ERROR__NO_INPUT');
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
    // proccess
    if (!databaseId) {
      return this.messageService.logError('DATABASE__ERROR__NO_DATABASE');
    }
    // get models
    let serverTables = {} as Record<string, string>; // current tables on the server
    const databaseGids = {} as Record<string, string>; // save public gids here
    const skippedTables = [] as string[]; // save skipped tables here
    let inputModels: {[name: string]: Model}; // all input models
    await this.messageService.logAction('Load data', async () => {
      // get server tables
      serverTables = await this.spreadsheetService.getSheets(
        googleClient,
        databaseId as string
      );
      // get project models
      let projectModels: {[name: string]: Model} = {};
      if (isValidProject) {
        projectModels = await this.modelService.loadProjectModels();
      }
      // get custom models
      let customModels: {[name: string]: Model} = {};
      if (!!input.length && input[0] !== '*') {
        // sort input by type
        const builtinInputs: string[] = [];
        const localInputs: string[] = [];
        const remoteInputs: string[] = [];
        for (let i = 0; i < input.length; i++) {
          const ipt = input[i];
          if (this.helperService.isUrl(ipt)) {
            remoteInputs.push(ipt);
          } else if (input.indexOf('.json') > -1) {
            localInputs.push(ipt);
          } else {
            builtinInputs.push(ipt);
          }
        }
        // load data
        let builtinModels: {[name: string]: Model} = {};
        let localModels: {[name: string]: Model} = {};
        let remoteModels: {[name: string]: Model} = {};
        if (builtinInputs.length) {
          builtinModels = await this.modelService.getBuiltinModels(
            builtinInputs
          );
        }
        if (localInputs.length) {
          localModels = await this.modelService.getLocalModels(localInputs);
        }
        if (remoteInputs.length) {
          remoteModels = await this.modelService.getRemoteModels(remoteInputs);
        }
        customModels = {...builtinModels, ...localModels, ...remoteModels};
      }
      // sum up models
      inputModels = {...projectModels, ...customModels};
      // refine input models
      // assign gid if not defined
      // and check for duplication
      const existingGids = {} as Record<string, string>;
      // set global gids
      Object.keys(serverTables).map(
        key => (existingGids[serverTables[key]] = key)
      );
      // check all input models
      for (const modelName of Object.keys(inputModels)) {
        const inputModel = inputModels[modelName];
        if (serverTables[modelName]) {
          skippedTables.push(modelName); // save to skipped tables
          delete inputModels[modelName]; // remove any model if already exists
        } else {
          const gid = inputModel.gid;
          if (!gid) {
            inputModel.gid = Math.round(Math.random() * 1e9);
            existingGids[inputModel.gid] = modelName;
          } else if (existingGids[gid]) {
            return this.messageService.logError(
              'PROJECT_MODEL__ERROR__DUPLICATE_GID',
              true,
              [modelName, existingGids[gid]]
            );
          } else {
            existingGids[gid] = modelName;
          }
        }
        // save public gids
        const inputModelGid = '' + inputModel.gid; // convert to string
        if (
          // must be public
          inputModel.public &&
          // not a builtin gid
          (inputModelGid.length !== 3 || inputModelGid[0] !== '1')
        ) {
          databaseGids[modelName] = inputModelGid;
        }
      }
    });
    // create
    await this.messageService.logAction('Create database tables:', async () => {
      // create table by table
      for (const modelName of Object.keys(inputModels)) {
        const inputModel = inputModels[modelName];
        const withData = !!inputModel.dataUrl && commandOptions.data;
        await this.spreadsheetService.createSheetByModel(
          googleClient,
          databaseId as string,
          modelName,
          inputModel
        );
        console.log(
          '   + ' +
            modelName +
            ' (' +
            inputModel.gid +
            ')' +
            (withData ? ' [data]' : '')
        );
        // add sample data
        if (withData) {
          const values = await this.fetchService.get(
            inputModel.dataUrl as string
          );
          // remove the header
          if (!!values && !!values[0] && values[0][0] === '#') {
            values.shift();
          }
          // import the values
          if (!!values && !!values.length) {
            await this.spreadsheetService.addData(
              googleClient,
              databaseId as string,
              modelName,
              values
            );
          }
        }
      }
      // save gid maps to config
      if (isValidProject && !!Object.keys(databaseGids).length) {
        await this.projectService.setConfigs({databaseGids});
      }
      // delete the default 'Sheet1'
      if (serverTables['Sheet1'] === '0') {
        await this.spreadsheetService.deleteDefaultSheet(
          googleClient,
          databaseId as string
        );
      }
    });
    // done
    if (skippedTables.length) {
      console.log('\n   Skipped: ' + skippedTables.join(', '));
    }
  }
}
