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

export type BasicScrapeTimetable = {
  firstAnchor: AnchorData;
  secondAnchor: AnchorData;
  subject: string;
  type: LessonType;
} | null;

export type ScrapeTimetable = {
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
