import {green, blue} from 'chalk';
const ttyTable = require('tty-table');

import {MessageService} from '../../lib/services/message.service';
import {ProjectService} from '../../lib/services/project.service';
import {ModelService} from '../../lib/services/model.service';

export interface DatabaseListCommandOptions {
  id?: string;
  remote?: boolean;
}

export class DatabaseListCommand {
  constructor(
    private messageService: MessageService,
    private projectService: ProjectService,
    private modelService: ModelService
  ) {}

  async run(commandOptions: DatabaseListCommandOptions) {
    if (!(await this.projectService.isValid())) {
      return this.messageService.logError('PROJECT__ERROR__INVALID');
    }
    // local
    else if (!commandOptions.remote) {
      const models = await this.modelService.loadProjectModels();
      for (const key of Object.keys(models)) {
        const {gid, schema, public: isPublic} = models[key];
        console.log(
          '\n + ' +
            green(key) +
            ` [${blue('' + (gid || 'auto'))}]` +
            (isPublic ? ' (public)' : '')
        );
        // preview
        const cols = [];
        const widths = [];
        for (let i = 0; i < schema.length; i++) {
          const item = schema[i];
          cols.push({value: item.name});
          widths.push(item.width || 100);
        }
        const table = ttyTable(cols, [widths]);
        console.log(table.render());
      }
    }
    // remote
    else {
      console.log('List database tables ...');
    }
  }
}
