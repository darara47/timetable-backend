import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ExternalApiModule } from './modules/external-api/external-api.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { ScrapeDataModule } from './modules/scrape-data/scrape-data.module';
import { SectionsModule } from './modules/sections/sections.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ExternalApiModule,
    ScrapeDataModule,
    SectionsModule,
    LessonsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
