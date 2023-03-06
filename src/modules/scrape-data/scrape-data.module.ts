import { Module } from '@nestjs/common';
import { ScrapeDataService } from './scrape-data.service';

@Module({
  imports: [],
  providers: [ScrapeDataService],
  controllers: [],
  exports: [ScrapeDataService],
})
export class ScrapeDataModule {}
