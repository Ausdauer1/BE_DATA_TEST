import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/hitter1')
  getObject(): object {
    return this.appService.getObject();
  }

  @Get('/pitcher1')
  getObject2(): object {
    return this.appService.getObject2();
  }
}
