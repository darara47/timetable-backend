import { SectionTypes } from '../../types/sections.types';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Timetable } from '../timetables/timetable.entity';

@Entity('sections')
@Unique(['name'])
@Unique(['url'])
export class Section {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @OneToMany(() => Timetable, (timetable) => timetable.section)
  @JoinColumn()
  timetables: Timetable[];

  @Column()
  type: SectionTypes;

  @CreateDateColumn({ select: false })
  createdDate: Date;

  @UpdateDateColumn({ select: false })
  updatedDate: Date;

  @DeleteDateColumn({ select: false })
  deletedDate: Date;
}
