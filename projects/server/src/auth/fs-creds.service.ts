import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { fscreds } from '../entity/freeswitch.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FsCredsService {
  constructor(
    @InjectRepository(fscreds)
    private freeswitchRepo: Repository<fscreds>,
  ) {}

  async getOne(username: string, password: string): Promise<fscreds> {
    try {
      const fsCredential = await this.freeswitchRepo.findOne({
        where: {
          username: username,
          password: password,
        },
      });

      console.log('Fs ', fsCredential);
      return fsCredential;
    } catch (err) {
      console.log('error loading vehicle - ', err);
    }
  }

  async getOneById(id: number): Promise<fscreds> {
    try {
      const vehicle = await this.freeswitchRepo.findOneOrFail(id);
      return vehicle;
    } catch (err) {
      console.log('error loading vehicle - ', err);
    }
  }
}
