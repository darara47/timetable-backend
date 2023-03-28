import { Controller, Get } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { ManageDatabaseService } from './manage-database.service';

@ApiExcludeController()
@ApiTags('Manage database')
@Controller('manage-database')
export class ManageDatabaseController {
  constructor(private readonly manageDatabaseService: ManageDatabaseService) {}

  @Get('update')
  async updateDatabase(): Promise<void> {
    const secretKey = process.env.CRON_SECRET_KEY;
    return this.manageDatabaseService.update(secretKey);
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCronUpdateDatabase() {
    const secretKey = process.env.CRON_SECRET_KEY;
    await this.manageDatabaseService.update(secretKey);
  }
}
