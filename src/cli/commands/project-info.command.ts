const ttyTable = require('tty-table');

import {ProjectService} from '../../lib/services/project.service';

export class ProjectInfoCommand {
  constructor(private projectService: ProjectService) {}

  async run() {
    const packageJson = await this.projectService.getPackageJson();
    const table = ttyTable(
      [
        {value: 'Key', width: 50, align: 'left'},
        {value: 'Value', width: 200, align: 'left'},
      ],
      []
    );
    const data = {...packageJson} as Record<string, unknown>;
    for (const key of Object.keys(data)) {
      table.push([key, data[key]]);
    }
    console.log(table.render());
  }
}
