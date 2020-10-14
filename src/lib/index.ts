import {HelperService} from './services/helper.service';

export class Lib {
  helperService: HelperService;

  constructor() {
    this.helperService = new HelperService();
  }
}
