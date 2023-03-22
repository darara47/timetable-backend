import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { QueryRunnerSource } from 'src/database/query-runner';
import { LessonsModule } from '../lessons/lessons.module';
import { SectionsModule } from '../sections/sections.module';
import { ManageDatabaseController } from './manage-database.controller';
import { ManageDatabaseService } from './manage-database.service';

@Module({
  imports: [ScheduleModule.forRoot(), LessonsModule, SectionsModule],
  providers: [ManageDatabaseService, QueryRunnerSource],
  controllers: [ManageDatabaseController],
  exports: [ManageDatabaseService],
})
export class ManageDatabaseModule {}
