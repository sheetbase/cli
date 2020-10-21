import {OAuth2Client} from 'google-auth-library';

export interface FileCreationRequestBody {
  name: string;
  mimeType: string;
  parents?: string[];
}

export interface FileCopyRequestBody {
  name: string;
  parents?: string[];
}

export class DriveService {
  constructor() {}

  async create(
    client: OAuth2Client,
    name: string,
    mimeType: string,
    parents: string[] = []
  ) {
    const requestData: FileCreationRequestBody = {
      name,
      mimeType,
    };
    if (parents) requestData.parents = parents;
    const {data} = await client.request<{id: string}>({
      method: 'POST',
      url: 'https://www.googleapis.com/drive/v3/files',
      data: requestData,
    });
    return data.id;
  }

  async createFile(
    client: OAuth2Client,
    name: string,
    mimeType: string,
    parents: string[] = []
  ) {
    return this.create(client, name, mimeType, parents);
  }

  async createFolder(
    client: OAuth2Client,
    name: string,
    parents: string[] = []
  ) {
    return this.create(
      client,
      name,
      'application/vnd.google-apps.folder',
      parents
    );
  }

  async copy(
    client: OAuth2Client,
    fileId: string,
    name: string,
    parents: string[] = []
  ) {
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
    return data.id;
  }

  async trash(client: OAuth2Client, fileId: string) {
    const {data} = await client.request({
      method: 'PATCH',
      url: `https://www.googleapis.com/drive/v3/files/${fileId}`,
      data: {
        trashed: true,
      },
    });
    return data;
  }

  async remove(client: OAuth2Client, fileId: string) {
    const {data} = await client.request({
      method: 'DELETE',
      url: `https://www.googleapis.com/drive/v3/files/${fileId}`,
    });
    return data;
  }
}
