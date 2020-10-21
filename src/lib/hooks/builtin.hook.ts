// import {generate as randomstringGenerate} from 'randomstring';
// import {prompt as inquirerPrompt} from 'inquirer';
// import {capitalCase} from 'change-case';
// import {Auth2Client} from 'google-auth-library';

// import {DriveService} from '../services/drive.service';

// interface System {
//   googleClient: OAuth2Client;
//   projectId: string;
//   projectName: string;
// }

// export class BuiltinHook {
//   private system: System;

//   constructor(system: System) {
//     this.system = system;
//   }

//   projectPrettyName() {
//     return capitalCase(this.system.projectName);
//   }

//   async randomStr(length = 32, punctuation = false) {
//     const charset =
//       'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     return randomstringGenerate({
//       length,
//       charset: charset + (punctuation ? '-_!@#$%&*' : ''),
//     });
//   }

//   async createDatabase(name?: string) {
//     return await this.driveCreateSheets(name || `${this.projectPrettyName()} Database`);
//   }

//   async driveCreateFolder(name?: string) {
//     const { googleClient, projectId } = this.system;
//     return await driveCreateFolder(
//       googleClient,
//       name || `${this.projectPrettyName()} Folder`,
//       [projectId],
//     );
//   }

//   async driveCreateFile(mimeType: string, name?: string) {
//     if (!mimeType) { throw new Error('Missing args.'); }
//     const { googleClient, projectId } = this.system;
//     return await driveCreateFile(
//       googleClient,
//       name || `${this.projectPrettyName()} File`,
//       mimeType,
//       [projectId],
//     );
//   }

//   async driveCopyFile(fileId: string, name?: string) {
//     if (!fileId) { throw new Error('Missing args.'); }
//     const { googleClient, projectId } = this.system;
//     return await copyFile(
//       googleClient,
//       fileId,
//       name || `${this.projectPrettyName()} Copied (${fileId})`,
//       [projectId],
//     );
//   }

//   async driveCreateSheets(name?: string) {
//     return await this.driveCreateFile(
//       'application/vnd.google-apps.spreadsheet',
//       name || `${this.projectPrettyName()} Sheets`
//     );
//   }

//   async userInput(message?: string) {
//     const {hookAnswer} = await inquirerPrompt([
//       {
//         type: 'input',
//         name: 'hookAnswer',
//         message: (message || 'Answer') + ':',
//       },
//     ]);
//     return hookAnswer;
//   }
// }

export class BuiltinHook {}
