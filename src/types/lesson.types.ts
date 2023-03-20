import { ApiProperty } from '@nestjs/swagger';

export enum LessonType {
  common = 'common',
  division = 'division',
  text = 'text',
}

export enum WeekDays {
  monday = 'monday',
  thuesday = 'thuesday',
  wednesday = 'wednesday',
  thursday = 'thursday',
  friday = 'friday',
}

export type AnchorData = { link?: string; text: string };

export type BasicScrapeLesson = {
  firstAnchor: AnchorData;
  secondAnchor: AnchorData;
  subject: string;
  type: LessonType;
} | null;

export type ScrapeLesson = {
  className?: string;
  classURL?: string;
  classroomName?: string;
  classroomURL?: string;
  lessonNumber: number;
  teacherName?: string;
  teacherURL?: string;
  subject: string;
  type: LessonType;
  weekDay: WeekDays;
} | null;

export class LessonResponse {
  @ApiProperty()
  className: string;

  @ApiProperty()
  classURL: string;

  @ApiProperty()
  classroomName: string;

  @ApiProperty()
  classroomURL: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  lessonNumber: number;

  @ApiProperty()
  teacherName: string;

  @ApiProperty()
  teacherURL: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  type: LessonType;

  @ApiProperty()
  weekDay: WeekDays;
}
