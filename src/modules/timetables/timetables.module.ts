import { Module } from '@nestjs/common';
import { ExternalApiModule } from '../external-api/external-api.module';
import { ScrapeDataModule } from '../scrape-data/scrape-data.module';
import { TimetablesController } from './timetables.controller';
import { TimetablesService } from './timetables.service';

@Module({
  imports: [ExternalApiModule, ScrapeDataModule],
  providers: [TimetablesService],
  controllers: [TimetablesController],
  exports: [TimetablesService],
})
export class TimetablesModule {}
