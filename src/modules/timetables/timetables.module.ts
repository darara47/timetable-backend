import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternalApiModule } from '../external-api/external-api.module';
import { ScrapeDataModule } from '../scrape-data/scrape-data.module';
import { Timetable } from './timetable.entity';
import { TimetablesService } from './timetables.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Timetable]),
    ExternalApiModule,
    ScrapeDataModule,
  ],
  providers: [TimetablesService],
  controllers: [],
  exports: [TimetablesService],
})
export class TimetablesModule {}
