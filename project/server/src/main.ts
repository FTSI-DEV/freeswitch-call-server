import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import ArenaConfig from './bull-queue/arenaConfig';

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

  // BullQueue Arena initialization
  Arena(ArenaConfig);
  
  await app.listen(3000);
}
bootstrap();
