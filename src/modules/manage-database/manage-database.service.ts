import { Injectable, Logger } from '@nestjs/common';
import { QueryRunnerSource } from 'src/database/query-runner';
import { Sections } from 'src/types/sections.types';
import { QueryRunner } from 'typeorm';
import { LessonsService } from '../lessons/lessons.service';
import { SectionsService } from '../sections/sections.service';

@Injectable()
export class ManageDatabaseService {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly queryRunnerSource: QueryRunnerSource,
    private readonly sectionsService: SectionsService,
  ) {}
  private readonly logger = new Logger(ManageDatabaseService.name);

  async update(secretKeyParam: string): Promise<void> {
    this.logger.log('Updating database.');

    const sections = await this.sectionsService.getSectionsFromApi();
    const correctKey = this.checkIfCorrectKey(secretKeyParam);
    const correctData = await this.checkIfCorrectData(sections);

    if (!correctKey) {
      this.logger.error('Wrong secret key.');
      return;
    }

    if (!correctData) {
      this.logger.error('Scraped data are invalid.');
      return;
    }

    const queryRunner = await this.queryRunnerSource.create();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.clearTables(queryRunner);

      await Promise.all(
        sections.map(async (section) => {
          const createdSection = await this.sectionsService.create(
            section,
            queryRunner,
          );
          const lessons = await this.lessonsService.getLessonFromApi(
            createdSection.url,
            createdSection.type,
          );
          await Promise.all(
            lessons.map(async (lesson) => {
              await this.lessonsService.create(
                {
                  ...lesson,
                  sectionId: createdSection.id,
                },
                queryRunner,
              );
            }),
          );
        }),
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      this.logger.log('Database updated successfully.');
    }
  }

  private checkIfCorrectKey(secretKeyParam: string): boolean {
    const secretKeyEnv = process.env.CRON_SECRET_KEY;

    return secretKeyParam === secretKeyEnv;
  }

  private async checkIfCorrectData(sections: Sections): Promise<boolean> {
    let canUpdate = true;
    const randomSection = sections[25];
    const lessons = await this.lessonsService.getLessonFromApi(
      randomSection.url,
      randomSection.type,
    );

    if (sections.length < 50) canUpdate = false;
    if (lessons.length < 20) canUpdate = false;

    return canUpdate;
  }

  private async clearTables(queryRunner: QueryRunner) {
    await queryRunner.query(`TRUNCATE sections CASCADE;`);
    await queryRunner.query(`TRUNCATE lessons CASCADE;`);
  }
}
