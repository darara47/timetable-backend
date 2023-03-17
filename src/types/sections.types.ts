import { ApiProperty } from '@nestjs/swagger';

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

export class SectionResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  type: SectionTypes;
}

export type Sections = Section[];
