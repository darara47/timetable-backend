import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { SectionsService } from './sections.service';

@ApiTags('Sections')
@Controller('sections')
export class SectionsController {
  constructor(private sectionsService: SectionsService) {}

  @Get()
  async getSections() {
    return this.sectionsService.getAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    example: '03a9dcb5-2d07-4732-9268-de68d24df0f2',
  })
  async getSectionWithTimetable(@Param('id') id: string) {
    return this.sectionsService.getSectionWithTimetable(id);
  }
}
