import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/initialData")
  getInitialData() {
    return this.appService.initialData();
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

  @Get("/allOtherData")
  async allOtherData() {
    return this.appService.allOtherData();
  }
  
  @Get("/getDateAndProfile")
  async getDateAndProfile() {
    return this.appService.getDateAndProfile();
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

