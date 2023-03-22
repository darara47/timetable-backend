import { IsEnum, IsString } from 'class-validator';
import { SectionTypes } from '../../../types/sections.types';

export class CreateSectionDto {
  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsEnum(SectionTypes)
  type: SectionTypes;
}
