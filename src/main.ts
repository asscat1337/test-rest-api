import 'reflect-metadata'
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const configSwagger = new DocumentBuilder()
    .setTitle(`Qtim test job REST API`)
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup(`docs`, app, document);

  await app.listen(3000);
}
bootstrap();
