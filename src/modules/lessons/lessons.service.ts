import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SectionTypes } from '../../types/sections.types';
import { LessonResponse, ScrapeLesson } from '../../types/lesson.types';
import { QueryRunner, Repository } from 'typeorm';
import { ExternalApiService } from '../external-api/external-api.service';
import { ScrapeDataService } from '../scrape-data/scrape-data.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { Lesson } from './lesson.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    private readonly externalApiService: ExternalApiService,
    private readonly scrapeDataService: ScrapeDataService,
  ) {}

  async getLessonsBySectionId(sectionId: string): Promise<LessonResponse[]> {
    const lessons = await this.lessonRepository.find({
      where: { section: { id: sectionId } },
      order: { weekDay: 'ASC', lessonNumber: 'ASC', subject: 'ASC' },
    });

    return lessons;
  }

  async getLessonFromApi(
    url: string,
    sectionType: SectionTypes,
  ): Promise<ScrapeLesson[]> {
    const dataAsHtmlString = await this.externalApiService.getLesson(url);
    const lesson = await this.scrapeDataService.scrapeLesson(
      dataAsHtmlString,
      sectionType,
      url,
    );

    return lesson;
  }

  async create(
    createLessonDto: CreateLessonDto,
    queryRunner: QueryRunner,
  ): Promise<Lesson> {
    const {
      className,
      classURL,
      classroomName,
      classroomURL,
      lessonNumber,
      sectionId,
      subject,
      teacherName,
      teacherURL,
      type,
      weekDay,
    } = createLessonDto;

    const section = queryRunner.manager.create(Lesson, {
      className,
      classURL,
      classroomName,
      classroomURL,
      lessonNumber,
      section: { id: sectionId },
      subject,
      teacherName,
      teacherURL,
      type,
      weekDay,
    });
    const savedSection = await queryRunner.manager.save(section);

    return savedSection;
  }
}
