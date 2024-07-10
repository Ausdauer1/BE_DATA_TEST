import { Injectable } from '@nestjs/common';
import * as hitter from './hitter.json'
import * as pitcher from './pitcher.json'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getObject(): object {
    return hitter
  }

  getObject2(): object {
    return pitcher
  }
}
