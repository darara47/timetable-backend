import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SectionResponse } from 'src/types/sections.types';
import { SectionsService } from './sections.service';

@ApiTags('Sections')
@Controller('sections')
export class SectionsController {
  constructor(private sectionsService: SectionsService) {}

  @Get()
  @ApiOkResponse({ isArray: true, type: SectionResponse })
  async getSections(): Promise<SectionResponse[]> {
    return this.sectionsService.getAll();
  }

  @Get('update/update')
  async update() {
    return this.sectionsService.updateDatabase();
  }
}
