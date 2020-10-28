import {resolve} from 'path';
import {pathExists, readJson} from 'fs-extra';

import {FileService} from './file.service';
import {ProjectService, ModelExtended} from './project.service';
import {FetchService} from './fetch.service';

export interface ModelSchema {
  name: string;
  width?: number;
  note?: string;
}

export interface Model {
  gid: string | number; // will be corverted to string
  public?: boolean;
  dataUrl?: string;
  schema: ModelSchema[];
}

export class ModelService {
  constructor(
    private fileService: FileService,
    private fetchService: FetchService,
    private projectService: ProjectService
  ) {}

  async getModelsPackageVersion() {
    const {dependencies} = await readJson('frontend/package.json');
    return dependencies['@sheetbase/models']
      .replace('~', '')
      .replace('^', '') as string;
  }

  async loadProjectModels(): Promise<{[name: string]: Model}> {
    // built-in models
    let builtinModels: {[name: string]: Model} = {};
    const {
      models: configBuiltinModels,
    } = await this.projectService.getSheetbaseJson();
    if (configBuiltinModels) {
      builtinModels = await this.getBuiltinModels(
        configBuiltinModels,
        await this.getModelsPackageVersion()
      );
    }
    // load models in 'models' folder
    const modelsPath = resolve('models');
    let localModels: {[name: string]: Model} = {};
    if (await pathExists(modelsPath)) {
      const filePaths = (await this.fileService.readdirAsync(modelsPath)).map(
        path => modelsPath + '/' + path
      );
      localModels = await this.getLocalModels(filePaths);
    }
    // all project models
    return {...builtinModels, ...localModels};
  }

  async getBuiltinModels(
    items: Array<string | ModelExtended>,
    version = 'latest'
  ) {
    const models = {} as Record<string, Model>;
    // get models
    for (let i = 0; i < items.length; i++) {
      const builtInModel = items[i];
      // get data
      let modelName =
        typeof builtInModel === 'string' ? builtInModel : builtInModel.from;
      const data: Model = await this.fetchService.get(
        `https://unpkg.com/@sheetbase/models@${version}/models/${modelName}.json`
      );
      // extends
      if (typeof builtInModel !== 'string') {
        const {name, gid, public: isPublic} = builtInModel;
        modelName = name; // rename
        data.gid = gid; // change gid
        if (isPublic) {
          data.public = true; // override public
        } else if (!isPublic && !!data.public) {
          delete data.public; // remove public
        }
      }
      // default sample data (for public table only)
      if (!!data.public && !data.dataUrl) {
        data.dataUrl = `https://unpkg.com/@sheetbase/models@${version}/data/${modelName}.json`;
      }
      // save to builtin
      models[modelName] = data;
    }
    return models;
  }

  async getLocalModels(filePaths: string[]) {
    const models = {} as Record<string, Model>;
    for (let i = 0; i < filePaths.length; i++) {
      const filePath = filePaths[i].replace(/\\/g, '/');
      const modelName = (filePath.split('/').pop() as string).replace(
        '.json',
        ''
      );
      const data: ModelSchema[] | Model = await readJson(resolve(filePath));
      models[modelName] =
        data instanceof Array
          ? (({gid: null, schema: data} as unknown) as Model)
          : data;
    }
    return models;
  }

  async getRemoteModels(urls: string[]): Promise<{[name: string]: Model}> {
    const models = {} as Record<string, Model>;
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const modelName = (url.split('/').pop() as string).replace('.json', '');
      const data: ModelSchema[] | Model = await this.fetchService.get(url);
      models[modelName] =
        data instanceof Array
          ? (({gid: null, schema: data} as unknown) as Model)
          : data;
    }
    return models;
  }
}
