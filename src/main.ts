import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';

dotenv.config();
async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);

  const re = 'localhost';
  const regexp = new RegExp(re, 'i');

  app.enableCors({
    origin: ['http://localhost:3000', regexp],
  });

  const config = new DocumentBuilder()
    .setTitle('Tygiel - timetable app')
    .setDescription('Below are all endpoints with example data')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useStaticAssets(`${__dirname}/assets/swagger-ui-dist`, {
    prefix: '/api',
  });

  await app.listen(process.env.APP_PORT);
}
bootstrap();
