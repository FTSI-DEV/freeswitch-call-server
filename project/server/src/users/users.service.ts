import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {

    //Of course in a real application, you wouldn't store a password in plain text. 
    //You'd instead use a library like bcrypt, with a salted one-way hash algorithm. 
    //With that approach, you'd only store hashed passwords, and then compare the stored password to a 
    //hashed version of the incoming password, thus never storing or exposing user passwords in plain text. 
    //To keep our sample app simple, we violate that absolute mandate and use plain text. Don't do this in your real app!
    private readonly users = [
        {
          userId: 1,
          username: 'john',
          password: 'changeme',
        },
        {
          userId: 2,
          username: 'maria',
          password: 'guess',
        },
      ];
    
      async findOne(username: string): Promise<User | undefined> {
        let result = this.users.find(user => user.username === username);
        console.log(`Result of finding user: ${result.username}`);
        console.log(`Username parameter: ${username}`);
        return result;
      }
}
