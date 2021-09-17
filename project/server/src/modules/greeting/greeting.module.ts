import { Module } from '@nestjs/common';
import { GREETING_SERVICE } from './greeting-service.interface';
import { GreetingController } from './greeting.controller';
import { PersonalGreetingService } from './persion-greeting.service';
import { ProfessionalGreetingService } from './professional-greeting.service';

@Module({
  controllers: [GreetingController],
  providers: [
    {
      useClass: PersonalGreetingService,
      provide: GREETING_SERVICE
    }
  ],
  exports: [GREETING_SERVICE]
})
export class GreetingModule {}
