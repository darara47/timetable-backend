import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternalApiModule } from '../external-api/external-api.module';
import { ScrapeDataModule } from '../scrape-data/scrape-data.module';
import { Section } from './section.entity';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Section]),
    ExternalApiModule,
    ScrapeDataModule,
  ],
  providers: [SectionsService],
  controllers: [SectionsController],
  exports: [SectionsService],
})
export class SectionsModule {}
