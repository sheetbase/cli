import {createWriteStream} from 'fs';
import {ensureDir} from 'fs-extra';
import axios from 'axios';

export class FetchService {
  constructor() {}

  async get(input: string) {
    const {data} = await axios({method: 'GET', url: input});
    return data;
  }

  async download(url: string, destination: string, fileName: string) {
    return new Promise((resolve, reject) => {
      const downloadedFilePath: string = destination + '/' + fileName;
      ensureDir(destination)
        .catch(reject)
        .then(() => {
          axios({
            method: 'GET',
            url,
            responseType: 'stream',
          }).then(downloadResponse => {
            // pipe the result stream into a file on disc
            downloadResponse.data.pipe(createWriteStream(downloadedFilePath));
            downloadResponse.data.on('end', () => resolve(downloadedFilePath));
            downloadResponse.data.on('error', reject);
          }, reject);
        }, reject);
    }) as Promise<string>;
  }
}
