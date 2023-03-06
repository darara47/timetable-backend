import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ExternalApiModule } from './modules/external-api/external-api.module';
import { ScrapeDataModule } from './modules/scrape-data/scrape-data.module';
import { TimetablesModule } from './modules/timetables/timetables.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ExternalApiModule,
    ScrapeDataModule,
    TimetablesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
