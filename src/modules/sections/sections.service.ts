import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SectionResponse, Sections } from 'src/types/sections.types';
import { Repository } from 'typeorm';
import { ExternalApiService } from '../external-api/external-api.service';
import { LessonsService } from '../lessons/lessons.service';
import { ScrapeDataService } from '../scrape-data/scrape-data.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { Section } from './section.entity';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    private readonly externalApiService: ExternalApiService,
    private readonly lessonsService: LessonsService,
    private readonly scrapeDataService: ScrapeDataService,
  ) {}

  async create(createSectionDto: CreateSectionDto): Promise<SectionResponse> {
    const { name, url, type } = createSectionDto;

    const section = this.sectionRepository.create({ name, url, type });
    const savedSection = await this.sectionRepository.save(section);

    return this.mapSection(savedSection);
  }

  async getAll(): Promise<SectionResponse[]> {
    const sections = await this.sectionRepository.find();

    return this.mapSections(sections);
  }

  async clearTable() {
    await this.sectionRepository.query(`TRUNCATE sections CASCADE;`);
  }

  async getSectionsFromApi(): Promise<Sections> {
    const dataAsHtmlString = await this.externalApiService.getSections();
    const sections = await this.scrapeDataService.scrapeSections(
      dataAsHtmlString,
    );

    return sections;
  }

  async updateDatabase(): Promise<void> {
    const sections = await this.getSectionsFromApi();
    const canUpdate = await this.checkIfCanUpdateDatabase(sections);

    if (canUpdate) {
      await this.lessonsService.clearTable();
      await this.clearTable();

      sections.forEach(async (section) => {
        const createdSection = await this.create(section);
        const lessons = await this.lessonsService.getLessonFromApi(
          createdSection.url,
          createdSection.type,
        );
        lessons.forEach(async (lesson) => {
          await this.lessonsService.create({
            ...lesson,
            sectionId: createdSection.id,
          });
        });
      });
    } else {
      console.error('Cannot update database.');
    }
  }

  async checkIfCanUpdateDatabase(sections: Sections): Promise<boolean> {
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

  private mapSections(sections: Section[]): SectionResponse[] {
    return sections.map(this.mapSection);
  }

  private mapSection(section: Section): SectionResponse {
    return {
      id: section.id,
      name: section.name,
      url: section.url,
      type: section.type,
    };
  }
}
