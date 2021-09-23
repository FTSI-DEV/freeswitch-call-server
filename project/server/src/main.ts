import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import ArenaConfig from './bull-queue/arenaConfig';

const Arena = require('bull-arena');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow crossorigin
  app.enableCors();

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Freeswitch Call Server')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // BullQueue Arena initialization
  Arena(ArenaConfig);
  
  await app.listen(3000);
}
bootstrap();
