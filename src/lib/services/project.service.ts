import {EOL} from 'os';
import {resolve} from 'path';
import {
  pathExists,
  readJson as fsReadJson,
  writeJson as fsWriteJson,
  outputFile as fsOutputFile,
} from 'fs-extra';
import {merge} from 'lodash';

export interface GithubProvider {
  gitUrl: string;
  master?: boolean;
}

export interface Deployment {
  provider: 'github' | 'firebase' | 'hosting' | 'server';
  destination: unknown | GithubProvider;
  url?: string;
  wwwDir?: string;
  stagingDir?: string;
}

export interface ModelExtended {
  from: string;
  name: string;
  gid: string | number;
  public?: boolean;
}

export interface SheetbaseJson {
  projectId?: string;
  configs?: {
    frontend?: {
      backendUrl?: string;
      [key: string]: unknown;
    };
    backend?: {
      [key: string]: unknown;
    };
  };
  configMaps?: {
    frontend?: string[];
    backend?: string[];
  };
  urlMaps?: {
    [configKey: string]: string[];
  };
  setupHooks?: {
    [configKey: string]: unknown[];
  };
  models?: Array<string | ModelExtended>;
  deployment?: Deployment;
}

export interface PackageJson {
  name: string;
  version?: string;
  description?: string;
  author?: string;
  homepage?: string;
  license?: string;
  repository?: {
    type: string;
    url: string;
  };
  bugs?: {
    url: string;
  };
  scripts?: {
    [script: string]: string;
  };
}

export interface ClaspConfigs {
  scriptId: string;
  projectId?: string;
}

export class ProjectService {
  private sheetbaseJsonPath = 'sheetbase.json';
  private packageJsonPath = 'package.json';
  private claspConfigPath = 'backend/.clasp.json';
  private backendDir = 'backend';
  private backendConfigPath = 'backend/src/sheetbase.config.ts';
  private frontendDir = 'frontend';
  private frontendConfigPath = 'frontend/src/sheetbase.config.ts';

  constructor() {}

  get BACKEND_DIR() {
    return this.backendDir;
  }

  get FRONTEND_DIR() {
    return this.frontendDir;
  }

  async getClaspConfigs(customRoot?: string): Promise<ClaspConfigs> {
    return this.readJson(this.claspConfigPath, customRoot);
  }

  async setClaspConfigs(
    data: ClaspConfigs,
    modifier?: boolean | {(currentData: {}, data: {}): {}},
    customRoot?: string
  ) {
    return this.writeJson(this.claspConfigPath, data, modifier, customRoot);
  }

  async getPath(...paths: string[]) {
    const [customRoot, ...children] = paths;
    let root = customRoot;
    if (!customRoot) {
      if (await pathExists(`./${this.sheetbaseJsonPath}`)) {
        root = '.';
      } else if (await pathExists(`../${this.sheetbaseJsonPath}`)) {
        root = '..';
      }
    }
    return root ? resolve(root, ...children) : '';
  }

  async isValid(customRoot = '.') {
    return !!(await this.getPath(customRoot));
  }

  async readJson(file: string, customRoot = '.') {
    return fsReadJson(await this.getPath(customRoot, file));
  }

  async writeJson<Data>(
    file: string,
    data: Data,
    modifier?: boolean | {(currentData: Data, data: Data): Data},
    customRoot = '.'
  ) {
    const filePath = await this.getPath(customRoot, file);
    // prepare the data
    if (!modifier || (!!modifier && modifier instanceof Function)) {
      const currentData = await fsReadJson(filePath);
      if (modifier) {
        data = (modifier as Function)(currentData, data);
      } else {
        data = merge(currentData, data);
      }
    }
    // save data
    await fsWriteJson(filePath, data, {spaces: 2});
  }

  async outputFile(file: string, content: string, customRoot = '.') {
    await fsOutputFile(await this.getPath(customRoot, file), content);
  }

  async getSheetbaseJson(customRoot = '.'): Promise<SheetbaseJson> {
    return this.readJson(this.sheetbaseJsonPath, customRoot);
  }

  async setSheetbaseJson(
    data: SheetbaseJson,
    modifier?:
      | boolean
      | {
          (currentData: SheetbaseJson, data: SheetbaseJson): SheetbaseJson;
        },
    customRoot = '.'
  ) {
    return this.writeJson(this.sheetbaseJsonPath, data, modifier, customRoot);
  }

  async getPackageJson(customRoot = '.'): Promise<PackageJson> {
    return this.readJson(this.packageJsonPath, customRoot);
  }

  async setPackageJson(
    data: PackageJson,
    modifier?:
      | boolean
      | {
          (currentData: PackageJson, data: PackageJson): PackageJson;
        },
    customRoot = '.'
  ) {
    return this.writeJson(this.packageJsonPath, data, modifier, customRoot);
  }

  async getConfigs(customRoot = '.') {
    const {configs} = await this.getSheetbaseJson(customRoot);
    return configs || {};
  }

  async setConfigs(data: Record<string, unknown>, customRoot = '.') {
    // load configs and config maps
    const {backend = {}, frontend = {}} = await this.getConfigs(customRoot);
    const {
      configMaps: {
        backend: backendFields = [],
        frontend: frontendFields = [],
      } = {},
    } = await this.getSheetbaseJson(customRoot);
    // sort out configs
    for (const key of Object.keys(data)) {
      if ((backendFields || []).includes(key)) {
        backend[key] = data[key];
      }
      if ((frontendFields || []).includes(key)) {
        frontend[key] = data[key];
      }
    }
    // save to sheetbase.json
    await this.setSheetbaseJson(
      {configs: {backend, frontend}},
      false,
      customRoot
    );
    // save to files
    await this.saveBackendConfigs(backend, customRoot);
    await this.saveFrontendConfigs(frontend, customRoot);
  }

  async resetConfigs(name: string, customRoot = '.') {
    const deployPath = await this.getPath(customRoot);
    // package.json
    await this.setPackageJson(
      {
        name,
        version: '0.0.1',
        description: 'A Sheetbase project',
      },
      (currentData, data) => {
        // keep only these fields
        const {author, homepage, license, scripts} = currentData;
        return {...data, author, homepage, license, scripts};
      },
      deployPath
    );
    // sheetbase.json
    await this.setSheetbaseJson(
      {
        projectId: '',
        configs: {
          backend: {},
          frontend: {},
        },
        deployment: undefined,
      },
      // override above fields and keep the rest
      (currentData, data) => ({...currentData, ...data}),
      deployPath
    );
    // backend/.clasp.json
    await this.setClaspConfigs({scriptId: ''}, true, deployPath);
  }

  async saveConfigs(filePath: string, data: {}, customRoot = '.') {
    let content =
      '' +
      '// Please do NOT edit this file directlly' +
      EOL +
      '// To synchronize set/update project configs:' +
      EOL +
      '// + From terminal, run $ sheetbase config set key=value|...' +
      EOL +
      '// + Or, edit configs in sheetbase.json, then run $ sheetbase config update' +
      EOL +
      'export const SHEETBASE_CONFIG = ';
    content = content + JSON.stringify(data, null, 2) + ';' + EOL;
    return this.outputFile(filePath, content, customRoot);
  }

  async getBackendConfigs(customRoot = '.') {
    const {backend} = await this.getConfigs(customRoot);
    return backend || {};
  }

  async setBackendConfigs(data: {}, customRoot = '.') {
    return this.setConfigs(data, customRoot);
  }

  async saveBackendConfigs(data: {}, customRoot = '.') {
    return this.saveConfigs(this.backendConfigPath, data, customRoot);
  }

  async getFrontendConfigs(customRoot = '.') {
    const {frontend} = await this.getConfigs(customRoot);
    return frontend || {};
  }

  async setFrontendConfigs(data: {}, customRoot = '.') {
    return this.setConfigs(data, customRoot);
  }

  async saveFrontendConfigs(data: {}, customRoot = '.') {
    return this.saveConfigs(this.frontendConfigPath, data, customRoot);
  }
}
