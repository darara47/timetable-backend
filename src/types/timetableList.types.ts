export enum TimetableListTypes {
  class = 'class',
  classroom = 'classroom',
  teacher = 'teacher',
}

export type TimetableList = {
  name: string;
  url: string;
  type: TimetableListTypes;
};
