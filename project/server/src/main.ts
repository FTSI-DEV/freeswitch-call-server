import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import ArenaConfig from './bull-queue/arenaConfig';
import * as cookieParser from 'cookie-parser';
import passport from 'passport';
import { useContainer } from 'class-validator';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { setup } from './setup';

const Arena = require('bull-arena');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow crossorigin
  app.enableCors();

  app.setGlobalPrefix('api');
  // Swagger
  const options = new DocumentBuilder()
    .setTitle('Freeswitch Call')
    .setVersion('1.0')
    .setBasePath('api')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  
  SwaggerModule.setup('/docs', app, document);

  setup(app)

  // BullQueue Arena initialization
  Arena(ArenaConfig);
  
  await app.listen(3000);
}
bootstrap();
