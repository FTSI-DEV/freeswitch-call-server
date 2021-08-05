import { Injectable } from '@nestjs/common';
require("dotenv").config("../config.env");

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
