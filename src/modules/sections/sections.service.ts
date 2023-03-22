import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { SectionResponse, Sections } from '../../types/sections.types';
import { QueryRunner, Repository } from 'typeorm';
import { ExternalApiService } from '../external-api/external-api.service';
import { ScrapeDataService } from '../scrape-data/scrape-data.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { Section } from './section.entity';

dotenv.config();
@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    private readonly externalApiService: ExternalApiService,
    private readonly scrapeDataService: ScrapeDataService,
  ) {}

  async getAll(): Promise<SectionResponse[]> {
    const sections = await this.sectionRepository.find();

    return this.mapSections(sections);
  }

  async getSectionsFromApi(): Promise<Sections> {
    const dataAsHtmlString = await this.externalApiService.getSections();
    const sections = await this.scrapeDataService.scrapeSections(
      dataAsHtmlString,
    );

    return sections;
  }

  async create(
    createSectionDto: CreateSectionDto,
    queryRunner: QueryRunner,
  ): Promise<SectionResponse> {
    const { name, url, type } = createSectionDto;

    const section = queryRunner.manager.create(Section, { name, url, type });
    const savedSection = await queryRunner.manager.save(section);

    return this.mapSection(savedSection);
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
