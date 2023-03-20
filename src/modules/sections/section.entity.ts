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
import { Lesson } from '../lessons/lesson.entity';

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

  @OneToMany(() => Lesson, (lesson) => lesson.section)
  @JoinColumn()
  lessons: Lesson[];

  @Column()
  type: SectionTypes;

  @CreateDateColumn({ select: false })
  createdDate: Date;

  @UpdateDateColumn({ select: false })
  updatedDate: Date;

  @DeleteDateColumn({ select: false })
  deletedDate: Date;
}
