type BasicLesson = {
  subject: string;
  teacher: string;
  classroom: string;
};

export type LessonData =
  | null
  | { text: string }
  | { common: BasicLesson }
  | { division: BasicLesson[] };

export type DailyTimetable = LessonData[];
