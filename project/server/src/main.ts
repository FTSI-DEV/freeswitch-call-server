import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // Swagger
    const config = new DocumentBuilder()
    .setTitle('Freeswitch Call Server')
    .setVersion('1.0')
    .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);

  await app.listen(3000);
}
bootstrap();
