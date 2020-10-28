import {promisify} from 'util';
import {readdir} from 'fs';
import {copy, remove, lstatSync} from 'fs-extra';
import * as zipper from 'adm-zip';

export class FileService {
  constructor() {}

  async readdirAsync(path: string) {
    return promisify(readdir)(path);
  }

  async unzip(src: string, dest: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        // waiting for .zip file ready policy
        setTimeout(() => {
          const zip = new zipper(src);
          zip.extractAllTo(dest, true);
          resolve(true);
        }, 1000);
      } catch (error) {
        reject(error);
      }
    });
  }

  async unwrap(dir: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.readdirAsync(dir).then((localPathChildren: string[]) => {
        const firstItem: string = dir + '/' + localPathChildren[0];
        if (
          localPathChildren.length === 1 &&
          lstatSync(firstItem).isDirectory()
        ) {
          copy(firstItem, dir)
            .catch(reject)
            .then(() => {
              // unwrap it
              return remove(firstItem);
            })
            .then(() => {
              // remove wrapped dir
              resolve(true);
            }, reject);
        }
      }, reject);
    });
  }

  getModifiedTime(path: string) {
    return lstatSync(path).mtime;
  }
}
