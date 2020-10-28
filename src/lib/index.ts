import {HelperService} from './services/helper.service';
import {HelpService} from './services/help.service';
import {TerminalService} from './services/terminal.service';
import {MessageService} from './services/message.service';
import {DriveService} from './services/drive.service';
import {GoogleService} from './services/google.service';
import {BuildService} from './services/build.service';
import {FetchService} from './services/fetch.service';
import {FileService} from './services/file.service';
import {GasService} from './services/gas.service';
import {ModelService} from './services/model.service';
import {ProjectService} from './services/project.service';
import {SpreadsheetService} from './services/spreadsheet.service';

export class Lib {
  helperService: HelperService;
  helpService: HelpService;
  terminalService: TerminalService;
  messageService: MessageService;
  driveService: DriveService;
  googleService: GoogleService;
  buildService: BuildService;
  fetchService: FetchService;
  fileService: FileService;
  gasService: GasService;
  modelService: ModelService;
  projectService: ProjectService;
  spreadsheetService: SpreadsheetService;

  constructor() {
    this.helperService = new HelperService();
    this.helpService = new HelpService();
    this.projectService = new ProjectService();
    this.messageService = new MessageService();
    this.terminalService = new TerminalService();
    this.fileService = new FileService();
    this.fetchService = new FetchService();
    this.googleService = new GoogleService();
    this.gasService = new GasService();
    this.driveService = new DriveService();
    this.spreadsheetService = new SpreadsheetService();
    this.modelService = new ModelService(
      this.fileService,
      this.fetchService,
      this.projectService
    );
    this.buildService = new BuildService(
      this.helperService,
      this.spreadsheetService
    );
  }
}
