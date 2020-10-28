import {pathExists, readFile} from 'fs-extra';
import {OAuth2Client} from 'google-auth-library';
const readDir = require('fs-readdir-recursive');

import {FileCopyRequestBody} from './drive.service';

export interface CreationRequestBody {
  title: string;
  parentId?: string;
}

export interface GasFile {
  name: string;
  type: string;
  source: string;
}

export class GasService {
  private deployPath = 'backend/deploy';
  private initContent = [
    {
      name: 'appsscript',
      type: 'JSON',
      source: `
        {
          "webapp": {
            "access": "ANYONE_ANONYMOUS",
            "executeAs": "USER_DEPLOYING"
          },
          "exceptionLogging": "STACKDRIVER"
        }
        `,
    },
    {
      name: 'index',
      type: 'SERVER_JS',
      source: `
        function doGet() {
          return HtmlService.createHtmlOutput('Sheetbase backend, init succeed ...');
        }
        `,
    },
  ];

  constructor() {}

  async create(
    client: OAuth2Client,
    title: string,
    parentId?: string
  ): Promise<string> {
    const requestData: CreationRequestBody = {
      title,
    };
    if (parentId) requestData.parentId = parentId;
    const {data} = await client.request<{scriptId: string}>({
      method: 'POST',
      url: 'https://script.googleapis.com/v1/projects',
      data: requestData,
    });
    return data.scriptId;
  }

  async copy(
    client: OAuth2Client,
    fileId: string,
    name: string,
    parents: string[] = []
  ): Promise<string> {
    const folderId: string = parents[0];
    const requestData: FileCopyRequestBody = {
      name,
    };
    if (parents) requestData.parents = parents;
    // copy the file
    const {data} = await client.request<{id: string; parents: string[]}>({
      method: 'POST',
      url: `https://www.googleapis.com/drive/v3/files/${fileId}/copy?fields=id,parents`,
      data: requestData,
    });
    // make sure the file in a correct folder
    const fileParents: string[] = ['root', ...data.parents];
    if (!fileParents.includes(folderId)) {
      await client.request({
        method: 'PATCH',
        url:
          `https://www.googleapis.com/drive/v3/files/${data.id}?` +
          `addParents=${folderId}&removeParents=${fileParents.join()}`,
        data: {
          name,
        },
      });
    }
    return data.id;
  }

  async getLocalContent(path: string): Promise<GasFile[]> {
    const files: GasFile[] = [];
    const types = {
      js: 'SERVER_JS',
      html: 'HTML',
      json: 'JSON',
    } as Record<string, string>;
    if (!(await pathExists(path + '/appsscript.json'))) {
      return [];
    }
    // read all except files or folders in BUILD_MAIN_CODE_IGNORE
    const localFiles = readDir(path);
    for (let i = 0; i < localFiles.length; i++) {
      const fileName = localFiles[i];
      // name
      const nameSplit = fileName.split('.');
      const name = nameSplit.shift().replace(/\\/g, '/');
      const ext = nameSplit.pop();
      // type
      const type = types[ext];
      // source
      const source: string = await readFile(`${path}/${fileName}`, 'utf-8');
      if (!!name && !!type && !!source) {
        files.push({
          name,
          type,
          source,
        });
      }
    }
    return files;
  }

  async push(client: OAuth2Client, scriptId: string, files?: GasFile[]) {
    if (!files) {
      files = await this.getLocalContent(this.deployPath);
    }
    const {data} = await client.request({
      method: 'PUT',
      url: `https://script.googleapis.com/v1/projects/${scriptId}/content`,
      data: {files},
    });
    return data;
  }

  async getVersions(client: OAuth2Client, scriptId: string) {
    const {data} = await client.request({
      method: 'GET',
      url: `https://script.googleapis.com/v1/projects/${scriptId}/versions`,
    });
    return data;
  }

  async setVersion(
    client: OAuth2Client,
    scriptId: string,
    description?: string
  ) {
    const requestData = {} as Record<string, unknown>;
    requestData.description = description || 'Update';
    const {data} = await client.request({
      method: 'POST',
      url: `https://script.googleapis.com/v1/projects/${scriptId}/versions`,
      data: requestData,
    });
    return data;
  }

  async getDeployments(client: OAuth2Client, scriptId: string) {
    const {data} = await client.request({
      method: 'GET',
      url: `https://script.googleapis.com/v1/projects/${scriptId}/deployments`,
    });
    return data;
  }

  async deploy(
    client: OAuth2Client,
    scriptId: string,
    versionNumber = 1,
    description?: string
  ) {
    const requestData = {} as Record<string, unknown>;
    requestData.versionNumber = versionNumber || 1;
    requestData.description = description || 'Deploy webapp';
    const {data} = await client.request({
      method: 'POST',
      url: `https://script.googleapis.com/v1/projects/${scriptId}/deployments`,
      data: requestData,
    });
    return data;
  }

  async redeploy(
    client: OAuth2Client,
    scriptId: string,
    deploymentId: string,
    versionNumber: number,
    description?: string
  ) {
    const requestData = {
      deploymentConfig: {
        scriptId,
        versionNumber,
        description: description
          ? description
          : `Update webapp V${versionNumber}`,
      },
    };
    const {data} = await client.request({
      method: 'PUT',
      url: `https://script.googleapis.com/v1/projects/${scriptId}/deployments/${deploymentId}`,
      data: requestData,
    });
    return data;
  }

  async undeploy(client: OAuth2Client, scriptId: string, deploymentId: string) {
    const {data} = await client.request({
      method: 'DELETE',
      url: `https://script.googleapis.com/v1/projects/${scriptId}/deployments/${deploymentId}`,
    });
    return data;
  }

  async initWebApp(
    client: OAuth2Client,
    scriptId: string,
    description?: string,
    pushContent = false
  ) {
    // update the content
    await this.push(
      client,
      scriptId,
      pushContent ? undefined : this.initContent
    );
    // create new version
    await this.setVersion(client, scriptId, 'Init');
    const result = (await this.deploy(
      client,
      scriptId,
      1,
      description || 'Init webapp'
    )) as Record<string, unknown>;
    return (result.entryPoints as Array<{webApp: string}>)[0].webApp;
  }

  async updateWebapp(
    client: OAuth2Client,
    scriptId: string,
    deploymentId: string,
    versionNumber?: number,
    versionDescription?: string
  ) {
    // deploy new version
    if (!versionNumber) {
      await this.push(client, scriptId);
      // create new version
      versionNumber = ((await this.setVersion(
        client,
        scriptId,
        versionDescription
      )) as Record<string, unknown>).versionNumber as number;
    }
    // redeploy or rollback
    return this.redeploy(
      client,
      scriptId,
      deploymentId,
      versionNumber,
      'V' + versionNumber + ' (' + versionDescription + ')'
    );
  }
}
