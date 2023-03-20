import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { LessonResponse } from '../../types/lesson.types';
import { LessonsService } from './lessons.service';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get(':sectionId')
  @ApiOkResponse({ isArray: true, type: LessonResponse })
  @ApiParam({
    name: 'sectionId',
    example: '0303555f-40a7-4124-9b5c-4c6963bb4c30',
  })
  async getLessonsBySectionId(
    @Param('sectionId') sectionId: string,
  ): Promise<LessonResponse[]> {
    return this.lessonsService.getLessonsBySectionId(sectionId);
  }
}
