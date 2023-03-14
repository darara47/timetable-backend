export enum SectionTypes {
  class = 'class',
  classroom = 'classroom',
  teacher = 'teacher',
}

export type Section = {
  name: string;
  url: string;
  type: SectionTypes;
};

export type SectionResponse = {
  id: string;
  name: string;
  url: string;
  timetables?: any;
  type: SectionTypes;
};

export type Sections = Section[];
