export class HelperService {
  constructor() {}

  buildValidFileName(name: string) {
    return name
      .replace(/ /g, '-')
      .replace(/</g, '-')
      .replace(/,/g, '-')
      .replace(/>/g, '-')
      .replace(/\./g, '-')
      .replace(/\?/g, '-')
      .replace(/\//g, '-')
      .replace(/:/g, '-')
      .replace(/;/g, '-')
      .replace(/"/g, '-')
      .replace(/'/g, '-')
      .replace(/\{/g, '-')
      .replace(/\[/g, '-')
      .replace(/\}/g, '-')
      .replace(/\]/g, '-')
      .replace(/\|/g, '-')
      .replace(/\\/g, '-')
      .replace(/`/g, '-')
      .replace(/~/g, '-')
      .replace(/!/g, '-')
      .replace(/@/g, '-')
      .replace(/#/g, '-')
      .replace(/\$/g, '-')
      .replace(/%/g, '-')
      .replace(/\^/g, '-')
      .replace(/&/g, '-')
      .replace(/\*/g, '-')
      .replace(/\(/g, '-')
      .replace(/\)/g, '-')
      .replace(/\+/g, '-')
      .replace(/=/g, '-');
  }

  buildKeyValueFromParams(params: string[]) {
    const output = {} as Record<string, unknown>;
    params.forEach(item => {
      const multipleSplit = item.split('|');
      multipleSplit.forEach(single => {
        const singleSplit = single.trim().split('=');
        if (singleSplit[1]) {
          output[singleSplit[0].trim()] = this.parseValue(
            singleSplit[1].trim()
          );
        }
      });
    });
    return output;
  }

  formatDate(date: Date): string {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    return monthNames[monthIndex] + ' ' + day + ', ' + year;
  }

  parseValue(value: unknown) {
    // TRUE
    if ((value + '').toLowerCase() === 'true') {
      value = true;
    }
    // FALSE
    else if ((value + '').toLowerCase() === 'false') {
      value = false;
    }
    // number
    else if (!isNaN(value as number)) {
      value = Number(value);
    }
    // JSON
    else {
      try {
        value = JSON.parse(value as string);
      } catch (e) {
        /* invalid json, keep value as is */
      }
    }
    return value;
  }

  replaceBetween(
    content: string,
    replaceWith: string,
    starts: string | string[][] = [],
    ends?: string
  ) {
    // process data
    if (typeof starts === 'string') {
      if (ends) {
        starts = [[starts, ends]];
      } else {
        starts = [];
      }
    }
    // replace
    for (let i = 0; i < starts.length; i++) {
      const [start, end] = starts[i] || ([] as string[]);
      if (!!start && !!end) {
        const reg = new RegExp(start + '(.*)' + end, 'g');
        content = content.replace(reg, start + replaceWith + end);
      }
    }
    return content;
  }

  isHostSubfolder(url: string) {
    return url.split('/').filter(Boolean).length > 2;
  }

  isUrl(str: string) {
    return str.indexOf('http') !== -1 && str.indexOf('://') !== -1;
  }
}
