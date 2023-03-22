import { Controller, Get, Logger, Param } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SectionResponse } from '../../types/sections.types';
import { SectionsService } from './sections.service';

@ApiTags('Sections')
@Controller('sections')
export class SectionsController {
  constructor(private sectionsService: SectionsService) {}
  private readonly logger = new Logger(SectionsService.name);

  @Get()
  @ApiOkResponse({ isArray: true, type: SectionResponse })
  async getSections(): Promise<SectionResponse[]> {
    return this.sectionsService.getAll();
  }

  @Get('update-database/:secretKey')
  async updateDatabase(@Param('secretKey') secretKey: string): Promise<void> {
    return this.sectionsService.updateDatabase(secretKey);
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCronUpdateDatabase() {
    this.logger.log('Updating database.');
    const secretKey = process.env.CRON_SECRET_KEY;
    await this.sectionsService.updateDatabase(secretKey);
  }
}
