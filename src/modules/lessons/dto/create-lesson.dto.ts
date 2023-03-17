import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { LessonType, WeekDays } from 'src/types/lesson.types';

export class CreateLessonDto {
  @IsString()
  className?: string;

  @IsString()
  classURL?: string;

  @IsString()
  classroomName?: string;

  @IsString()
  classroomURL?: string;

  @IsNumber()
  lessonNumber: number;

  @IsNotEmpty()
  @IsString()
  sectionId: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsString()
  teacherName?: string;

  @IsString()
  teacherURL?: string;

  @IsEnum(LessonType)
  type: LessonType;

  @IsEnum(WeekDays)
  weekDay: WeekDays;
}
