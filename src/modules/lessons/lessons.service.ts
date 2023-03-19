import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SectionTypes } from 'src/types/sections.types';
import { LessonResponse, ScrapeLesson } from 'src/types/lesson.types';
import { Repository } from 'typeorm';
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

  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
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

    const section = this.lessonRepository.create({
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
    const savedSection = await this.lessonRepository.save(section);

    return savedSection;
  }

  async clearTable() {
    await this.lessonRepository.query(`TRUNCATE sections CASCADE;`);
  }
}
