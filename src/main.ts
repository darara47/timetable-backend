import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const re = 'localhost';
  const regexp = new RegExp(re, 'i');

  app.enableCors({
    origin: ['http://localhost:3000', regexp],
  });

  const config = new DocumentBuilder()
    .setTitle('App to management library')
    .setDescription('All endpoints with example data')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.APP_PORT);
}
bootstrap();
