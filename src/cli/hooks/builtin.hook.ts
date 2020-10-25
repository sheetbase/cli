import {generate as randomstringGenerate} from 'randomstring';
import {prompt as inquirerPrompt} from 'inquirer';
import {capitalCase} from 'change-case';
import {OAuth2Client} from 'google-auth-library';

import {DriveService} from '../../lib/services/drive.service';

interface System {
  googleClient: OAuth2Client;
  projectId: string;
  projectName: string;
}

export class BuiltinHook {
  private system: System;

  constructor(private driveService: DriveService, system: System) {
    this.system = system;
  }

  projectCapitalName() {
    return capitalCase(this.system.projectName);
  }

  async randomStr(length = 32, punctuation = false) {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return randomstringGenerate({
      length,
      charset: charset + (punctuation ? '-_!@#$%&*' : ''),
    });
  }

  async createDatabase(name?: string) {
    return this.driveCreateSheets(
      name || `${this.projectCapitalName()} Database`
    );
  }

  async driveCreateFolder(name?: string) {
    const {googleClient, projectId} = this.system;
    return this.driveService.createFolder(
      googleClient,
      name || `${this.projectCapitalName()} Folder`,
      [projectId]
    );
  }

  async driveCreateFile(mimeType: string, name?: string) {
    if (!mimeType) {
      throw new Error('Missing args.');
    }
    const {googleClient, projectId} = this.system;
    return this.driveService.createFile(
      googleClient,
      name || `${this.projectCapitalName()} File`,
      mimeType,
      [projectId]
    );
  }

  async driveCopyFile(fileId: string, name?: string) {
    if (!fileId) {
      throw new Error('Missing args.');
    }
    const {googleClient, projectId} = this.system;
    return this.driveService.copy(
      googleClient,
      fileId,
      name || `${this.projectCapitalName()} Copied (${fileId})`,
      [projectId]
    );
  }

  async driveCreateSheets(name?: string) {
    return await this.driveCreateFile(
      'application/vnd.google-apps.spreadsheet',
      name || `${this.projectCapitalName()} Sheets`
    );
  }

  async userInput(message?: string) {
    const {hookAnswer} = await inquirerPrompt([
      {
        type: 'input',
        name: 'hookAnswer',
        message: (message || 'Answer') + ':',
      },
    ]);
    return hookAnswer;
  }
}
