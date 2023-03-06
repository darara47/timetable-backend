import { Injectable } from '@nestjs/common';
import { SectionResponse, Sections } from 'src/types/sections.types';
import { Repository } from 'typeorm';
import { ExternalApiService } from '../external-api/external-api.service';
import { ScrapeDataService } from '../scrape-data/scrape-data.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { Section } from './section.entity';

@Injectable()
export class SectionsService {
  constructor(
    private readonly sectionRepository: Repository<Section>,
    private readonly externalApiService: ExternalApiService,
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

  async hardDelete(id: string) {
    await this.sectionRepository.delete(id);
  }

  async getSections(): Promise<Sections> {
    const dataAsHtmlString = await this.externalApiService.getSections();
    const sections = await this.scrapeDataService.scrapeTimetableList(
      dataAsHtmlString,
    );

    return sections;
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
