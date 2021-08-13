import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EslServerHelper } from './helpers/fs-esl/server';
import { StartFreeswitchApplication } from './helpers/fs-esl/event-socket-monitor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // Swagger
    const config = new DocumentBuilder()
    .setTitle('Freeswitch Call Server')
    .setVersion('1.0')
    .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);
    
    // new StartFreeswitchApplication().startFS();
    //starting esl-server
    new EslServerHelper().startEslServer()

  await app.listen(3000);
}
bootstrap();
