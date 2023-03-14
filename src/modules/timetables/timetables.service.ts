import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SectionTypes } from 'src/types/sections.types';
import { ScrapeTimetable } from 'src/types/timetable.types';
import { Repository } from 'typeorm';
import { ExternalApiService } from '../external-api/external-api.service';
import { ScrapeDataService } from '../scrape-data/scrape-data.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { Timetable } from './timetable.entity';

@Injectable()
export class TimetablesService {
  constructor(
    @InjectRepository(Timetable)
    private readonly timetableRepository: Repository<Timetable>,
    private readonly externalApiService: ExternalApiService,
    private readonly scrapeDataService: ScrapeDataService,
  ) {}

  async create(createTimetableDto: CreateTimetableDto): Promise<Timetable> {
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
    } = createTimetableDto;

    const section = this.timetableRepository.create({
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
    const savedSection = await this.timetableRepository.save(section);

    return savedSection;
  }

  async clearTable() {
    await this.timetableRepository.query(`TRUNCATE sections CASCADE;`);
  }

  async getTimetableFromApi(
    url: string,
    sectionType: SectionTypes,
  ): Promise<ScrapeTimetable[]> {
    const dataAsHtmlString = await this.externalApiService.getTimetable(url);
    const timetable = await this.scrapeDataService.scrapeTimetable(
      dataAsHtmlString,
      sectionType,
    );

    return timetable;
  }
}
