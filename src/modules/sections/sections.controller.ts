import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SectionsService } from './sections.service';

@ApiTags('Sections')
@Controller('sections')
export class SectionsController {
  constructor(private sectionsService: SectionsService) {}

  @Get()
  async getSections() {
    return this.sectionsService.getAll();
  }
}
