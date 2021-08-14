import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { fscreds } from '../entity/freeswitch.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ApiCredential } from 'src/models/apiCredential.model';
import { configService } from 'src/config/config.service';

@Injectable()
export class AuthService {
  constructor(
    //  @InjectRepository(fscreds)
    // private freeswitchRepo: Repository<fscreds>,
      private usersService: UsersService,
      private jwtService: JwtService,
      ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    console.log(`Validating username: ${username} , password: ${pass}`);
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  
  async login(user: any){
      const payload = { username: user.username, sub: user.userId};
      return {
          access_token: this.jwtService.sign(payload)
      }
  }

  // async getOneById(id: number): Promise<fscreds> {
  //   try {
  //     const vehicle = await this.freeswitchRepo.findOneOrFail(id);
  //     return vehicle;
  //   } catch (err) {
  //     console.log('error loading vehicle - ', err);
  //   }
  // }

  validateApiCredential(apiKey:string, apiPassword: string):boolean
  {
    let result = configService.validateApiCredential(apiKey, apiPassword);
    return result;
  }

}
