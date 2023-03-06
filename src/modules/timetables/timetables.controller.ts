import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TimetablesService } from './timetables.service';

@ApiTags('Timetable')
@Controller('timetable')
export class TimetablesController {
  constructor(private timetablesService: TimetablesService) {}

  @Get()
  async getTimetable() {
    this.timetablesService.getTimetable();
  }
}
