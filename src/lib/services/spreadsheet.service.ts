import {OAuth2Client} from 'google-auth-library';

import {Model} from './model.service';

export class SpreadsheetService {
  constructor() {}

  async getSheets(client: OAuth2Client, spreadsheetId: string) {
    const {data} = await client.request({
      method: 'GET',
      url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
      params: {
        ranges: [],
        includeGridData: false,
      },
    });
    const {sheets} = data as {sheets: Array<Record<string, unknown>>};
    // get name and gid
    const result = {} as Record<string, string>;
    for (let i = 0; i < sheets.length; i++) {
      const {sheetId, title: name} = sheets[i].properties as Record<
        string,
        unknown
      >;
      result[name as string] = '' + sheetId;
    }
    return result;
  }

  async createSheetByModel(
    client: OAuth2Client,
    spreadsheetId: string,
    sheetName: string,
    model: Model
  ) {
    const {gid: sheetId, schema} = model;
    const columnCount = schema.length;

    // build configs
    const values = [];
    const widths = [];
    for (let i = 0; i < schema.length; i++) {
      const item = schema[i];

      // values
      const value = {
        userEnteredValue: {
          stringValue: item.name,
        },
        userEnteredFormat: {
          backgroundColor: {red: 0.8, green: 0.8, blue: 0.8},
          textFormat: {bold: true},
          horizontalAlignment: 'CENTER',
        },
      } as Record<string, unknown>;
      if (item.note) {
        value['note'] = item.note;
      }
      values.push(value);

      // columns size
      if (item.width) {
        widths.push({
          updateDimensionProperties: {
            range: {
              sheetId,
              dimension: 'COLUMNS',
              startIndex: i,
              endIndex: i + 1,
            },
            properties: {
              pixelSize: item.width,
            },
            fields: 'pixelSize',
          },
        });
      }
    }

    // sum up request data
    const requestData = {
      requests: [
        // add the sheet
        {
          addSheet: {
            properties: {
              sheetId,
              title: sheetName,
              gridProperties: {
                rowCount: 2,
                columnCount,
                frozenRowCount: 1,
                frozenColumnCount: 2,
              },
            },
          },
        },

        // set values
        {
          updateCells: {
            rows: [{values}, {values: []}],
            fields: '*',
            range: {
              sheetId,
              startRowIndex: 0,
              endRowIndex: 2,
              startColumnIndex: 0,
              endColumnIndex: columnCount,
            },
          },
        },

        // set columns size
        ...widths,
      ],
    };

    // send the request
    return client.request({
      method: 'POST',
      url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
      data: requestData,
    });
  }

  async addData(
    client: OAuth2Client,
    spreadsheetId: string,
    sheetName: string,
    values: unknown[]
  ) {
    // range
    const range = sheetName + '!A:A';

    // prepare the request data
    const requestData = {
      majorDimension: 'ROWS',
      values,
    };

    // send the request
    return client.request({
      method: 'POST',
      url:
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?` +
        'valueInputOption=USER_ENTERED&' +
        'insertDataOption=OVERWRITE',
      data: requestData,
    });
  }

  async deleteDefaultSheet(client: OAuth2Client, spreadsheetId: string) {
    return this.deleteSheet(client, spreadsheetId, 0);
  }

  async deleteSheet(
    client: OAuth2Client,
    spreadsheetId: string,
    sheetId: string | number
  ) {
    const requestData = {
      requests: [
        {
          deleteSheet: {sheetId: Number(sheetId)},
        },
      ],
    };

    // send the request
    return client.request({
      method: 'POST',
      url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
      data: requestData,
    });
  }

  async getRawData(
    client: OAuth2Client,
    spreadsheetId: string,
    sheetName: string
  ) {
    const {data} = await client.request({
      method: 'GET',
      url: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A1:ZZ`,
    });
    return (data as {values: unknown[][]}).values;
  }

  async getData(
    client: OAuth2Client,
    spreadsheetId: string,
    sheetName: string
  ) {
    const values = await this.getRawData(client, spreadsheetId, sheetName);
    return this.translateRangeValues(values);
  }

  // turn [[],[], ...] to [{},{}, ...]
  translateRangeValues<Item extends Record<string, unknown>>(
    values: unknown[][],
    noHeader = false,
    modifier = (item: Item) => item
  ) {
    values = values || [];
    // get header
    const headers = (!noHeader ? values.shift() : []) as string[];
    // build data
    const result: Item[] = [];
    for (let i = 0; i < values.length; i++) {
      const item = {} as Record<string, unknown>;
      // process columns
      const rows = values[i] || [];
      for (let j = 0; j < rows.length; j++) {
        if (rows[j]) {
          item[headers[j] || 'value' + (j + 1)] = rows[j];
        }
      }
      if (Object.keys(item).length > 0) {
        item['_row'] = !noHeader ? i + 2 : i + 1;
        result.push(modifier(item as Item));
      }
    }
    return result;
  }
}
