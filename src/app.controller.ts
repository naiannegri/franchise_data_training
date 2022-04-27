import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/getInitialData")
  getInitialData() {
    return this.appService.getDetails();
  }

  @Get("/getDetails")
  getDetails() {
    return this.appService.getDetails();
  }
  
  @Get("/getMoreData")
  async getMoreData() {
    return this.appService.getCompanyDetails();
  }

  @Get("/filtering")
  async filtering() {
    return this.appService.filtering();
  }

  @Get("/getMoreDataNecessary")
  async getMoreDataNecessary() {
    return this.appService.getMoreDataNecessary();
  }


  @Get("/connect")
  async getConnect() {
    return this.appService.connect();
  }
  
  @Get("/hello")
  async getHello() {
    return this.appService.getHello();
  }
}

