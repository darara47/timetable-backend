import { LessonType, WeekDays } from '../../types/lesson.types';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Section } from '../sections/section.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  className: string;

  @Column({ nullable: true })
  classURL: string;

  @Column({ nullable: true })
  classroomName: string;

  @Column({ nullable: true })
  classroomURL: string;

  @Column()
  lessonNumber: number;

  @ManyToOne(() => Section, (section) => section.id)
  section: Section;

  @Column()
  subject: string;

  @Column({ nullable: true })
  teacherName: string;

  @Column({ nullable: true })
  teacherURL: string;

  @Column({ nullable: true })
  type: LessonType;

  @Column()
  weekDay: WeekDays;

  @CreateDateColumn({ select: false })
  createdDate: Date;

  @UpdateDateColumn({ select: false })
  updatedDate: Date;

  @DeleteDateColumn({ select: false })
  deletedDate: Date;
}
