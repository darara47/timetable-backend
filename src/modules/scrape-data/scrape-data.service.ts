import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import { Sections, SectionTypes } from 'src/types/sections.types';
import {
  AnchorData,
  BasicScrapeTimetable,
  LessonType,
  ScrapeTimetable,
  WeekDays,
} from 'src/types/timetable.types';

@Injectable()
export class ScrapeDataService {
  async scrapeSections(data: string): Promise<Sections> {
    const dom = new JSDOM(data);
    const document = dom.window.document;
    const list = Array.from(document.getElementsByTagName('li'));

    const timetableList = list.map((item: Element) => {
      const anchor = item.getElementsByTagName('a').item(0);

      const name = anchor.textContent;
      const url = anchor.getAttribute('href');
      let type: SectionTypes;

      if (url.includes('plany/o')) type = SectionTypes.class;
      if (url.includes('plany/n')) type = SectionTypes.teacher;
      if (url.includes('plany/s')) type = SectionTypes.classroom;

      return {
        name,
        url,
        type,
      };
    });

    return timetableList;
  }

  async scrapeTimetable(
    data: string,
    sectionType: SectionTypes,
  ): Promise<ScrapeTimetable[]> {
    const dom = new JSDOM(data);
    const document = dom.window.document;
    const table = document.getElementsByTagName('table').item(2);

    const timetables: ScrapeTimetable[] = [];

    const lessons = Array.from(table.getElementsByClassName('l'));
    lessons.forEach((lesson: Element, index: number) => {
      let lessonData: BasicScrapeTimetable[] = null;
      let mappedLessonData: ScrapeTimetable[] = null;

      const getWeekDay = (): WeekDays => {
        if (index % 5 === 0) {
          return WeekDays.monday;
        } else if (index % 5 === 1) {
          return WeekDays.thuesday;
        } else if (index % 5 === 2) {
          return WeekDays.wednesday;
        } else if (index % 5 === 3) {
          return WeekDays.thursday;
        } else if (index % 5 === 4) {
          return WeekDays.friday;
        }
      };
      const lessonNumber = Math.floor(index / 5);

      if (lesson.hasChildNodes()) {
        const spanTags = lesson.getElementsByTagName('span');
        const aTags = lesson.getElementsByTagName('a');
        const pClasses = lesson.getElementsByClassName('p');
        const nClasses = lesson.getElementsByClassName('n');
        const sClasses = lesson.getElementsByClassName('s');

        if (
          spanTags.length === 1 &&
          aTags.length === 2 &&
          pClasses.length === 1
        ) {
          lessonData = [
            {
              firstAnchor: {
                link: aTags[0].getAttribute('href'),
                text: aTags[0].textContent,
              },
              secondAnchor: {
                link: aTags[1].getAttribute('href'),
                text: aTags[1].textContent,
              },
              subject: spanTags[0].textContent,
              type: LessonType.common,
            },
          ];
        } else if (
          spanTags.length === 2 &&
          aTags.length === 2 &&
          pClasses.length === 1
        ) {
          lessonData = [
            {
              firstAnchor: {
                link: aTags[0].getAttribute('href'),
                text: aTags[0].textContent,
              },
              secondAnchor: {
                link: aTags[1].getAttribute('href'),
                text: aTags[1].textContent,
              },
              subject: spanTags[1].textContent,
              type: LessonType.division,
            },
          ];
        } else if (
          spanTags.length === 4 &&
          aTags.length === 4 &&
          pClasses.length === 2
        ) {
          lessonData = [
            {
              firstAnchor: {
                link: aTags[0].getAttribute('href'),
                text: aTags[0].textContent,
              },
              secondAnchor: {
                link: aTags[1].getAttribute('href'),
                text: aTags[1].textContent,
              },
              subject: spanTags[1].textContent,
              type: LessonType.division,
            },
            {
              firstAnchor: {
                link: aTags[2].getAttribute('href'),
                text: aTags[2].textContent,
              },
              secondAnchor: {
                link: aTags[3].getAttribute('href'),
                text: aTags[3].textContent,
              },
              subject: spanTags[3].textContent,
              type: LessonType.division,
            },
          ];
        } else if (
          spanTags.length === 6 &&
          aTags.length === 6 &&
          pClasses.length === 3
        ) {
          lessonData = [
            {
              firstAnchor: {
                link: aTags[0].getAttribute('href'),
                text: aTags[0].textContent,
              },
              secondAnchor: {
                link: aTags[1].getAttribute('href'),
                text: aTags[1].textContent,
              },
              subject: spanTags[1].textContent,
              type: LessonType.division,
            },
            {
              firstAnchor: {
                link: aTags[2].getAttribute('href'),
                text: aTags[2].textContent,
              },
              secondAnchor: {
                link: aTags[3].getAttribute('href'),
                text: aTags[3].textContent,
              },
              subject: spanTags[3].textContent,
              type: LessonType.division,
            },
            {
              firstAnchor: {
                link: aTags[4].getAttribute('href'),
                text: aTags[4].textContent,
              },
              secondAnchor: {
                link: aTags[5].getAttribute('href'),
                text: aTags[5].textContent,
              },
              subject: spanTags[5].textContent,
              type: LessonType.division,
            },
          ];
        } else if (
          pClasses.length === 1 &&
          nClasses.length === 1 &&
          sClasses.length === 1
        ) {
          mappedLessonData = [
            {
              classroomName: sClasses[0].textContent,
              lessonNumber,
              subject: pClasses[0].textContent,
              teacherName: nClasses[0].textContent,
              type: LessonType.common,
              weekDay: getWeekDay(),
            },
          ];
        } else if (
          pClasses.length === 2 &&
          nClasses.length === 2 &&
          sClasses.length === 2
        ) {
          mappedLessonData = [
            {
              classroomName: sClasses[0].textContent,
              lessonNumber,
              subject: pClasses[0].textContent,
              teacherName: nClasses[0].textContent,
              type: LessonType.division,
              weekDay: getWeekDay(),
            },
            {
              classroomName: sClasses[1].textContent,
              lessonNumber,
              subject: pClasses[1].textContent,
              teacherName: nClasses[1].textContent,
              type: LessonType.division,
              weekDay: getWeekDay(),
            },
          ];
        } else if (
          pClasses.length === 3 &&
          nClasses.length === 3 &&
          sClasses.length === 3
        ) {
          mappedLessonData = [
            {
              classroomName: sClasses[0].textContent,
              lessonNumber,
              subject: pClasses[0].textContent,
              teacherName: nClasses[0].textContent,
              type: LessonType.division,
              weekDay: getWeekDay(),
            },
            {
              classroomName: sClasses[1].textContent,
              lessonNumber,
              subject: pClasses[1].textContent,
              teacherName: nClasses[1].textContent,
              type: LessonType.division,
              weekDay: getWeekDay(),
            },
            {
              classroomName: sClasses[2].textContent,
              lessonNumber,
              subject: pClasses[2].textContent,
              teacherName: nClasses[2].textContent,
              type: LessonType.division,
              weekDay: getWeekDay(),
            },
          ];
        } else if (
          pClasses.length === 4 &&
          nClasses.length === 4 &&
          sClasses.length === 4
        ) {
          mappedLessonData = [
            {
              classroomName: sClasses[0].textContent,
              lessonNumber,
              subject: pClasses[0].textContent,
              teacherName: nClasses[0].textContent,
              type: LessonType.division,
              weekDay: getWeekDay(),
            },
            {
              classroomName: sClasses[1].textContent,
              lessonNumber,
              subject: pClasses[1].textContent,
              teacherName: nClasses[1].textContent,
              type: LessonType.division,
              weekDay: getWeekDay(),
            },
            {
              classroomName: sClasses[2].textContent,
              lessonNumber,
              subject: pClasses[2].textContent,
              teacherName: nClasses[2].textContent,
              type: LessonType.division,
              weekDay: getWeekDay(),
            },
            {
              classroomName: sClasses[3].textContent,
              lessonNumber,
              subject: pClasses[3].textContent,
              teacherName: nClasses[3].textContent,
              type: LessonType.division,
              weekDay: getWeekDay(),
            },
          ];
        } else if (
          spanTags.length === 2 &&
          aTags.length === 1 &&
          pClasses.length === 2 &&
          nClasses.length === 0 &&
          sClasses.length === 1
        ) {
          lessonData = [
            {
              firstAnchor: { text: spanTags[1].textContent },
              secondAnchor: {
                link: aTags[0].getAttribute('href'),
                text: aTags[0].textContent,
              },
              subject: spanTags[0].textContent,
              type: LessonType.division,
            },
          ];
        } else if (
          spanTags.length === 4 &&
          aTags.length === 3 &&
          pClasses.length === 3 &&
          nClasses.length === 1 &&
          sClasses.length === 2
        ) {
          if (spanTags[0].getElementsByTagName('span').length === 0) {
            lessonData = [
              {
                firstAnchor: { text: spanTags[1].textContent },
                secondAnchor: {
                  link: aTags[0].getAttribute('href'),
                  text: aTags[0].textContent,
                },
                subject: spanTags[0].textContent,
                type: LessonType.division,
              },
              {
                firstAnchor: {
                  link: aTags[1].getAttribute('href'),
                  text: aTags[1].textContent,
                },
                secondAnchor: {
                  link: aTags[2].getAttribute('href'),
                  text: aTags[2].textContent,
                },
                subject: spanTags[3].textContent,
                type: LessonType.division,
              },
            ];
          } else if (spanTags[2].getElementsByTagName('span').length === 0) {
            lessonData = [
              {
                firstAnchor: {
                  link: aTags[0].getAttribute('href'),
                  text: aTags[0].textContent,
                },
                secondAnchor: {
                  link: aTags[1].getAttribute('href'),
                  text: aTags[1].textContent,
                },
                subject: spanTags[1].textContent,
                type: LessonType.division,
              },
              {
                firstAnchor: { text: spanTags[3].textContent },
                secondAnchor: {
                  link: aTags[2].getAttribute('href'),
                  text: aTags[2].textContent,
                },
                subject: spanTags[2].textContent,
                type: LessonType.division,
              },
            ];
          }
        } else if (
          spanTags.length === 6 &&
          aTags.length === 5 &&
          pClasses.length === 4 &&
          nClasses.length === 2 &&
          sClasses.length === 3
        ) {
          if (spanTags[0].getElementsByTagName('span').length === 0) {
            lessonData = [
              {
                firstAnchor: { text: spanTags[1].textContent },
                secondAnchor: {
                  link: aTags[0].getAttribute('href'),
                  text: aTags[0].textContent,
                },
                subject: spanTags[0].textContent,
                type: LessonType.division,
              },
              {
                firstAnchor: {
                  link: aTags[1].getAttribute('href'),
                  text: aTags[1].textContent,
                },
                secondAnchor: {
                  link: aTags[2].getAttribute('href'),
                  text: aTags[2].textContent,
                },
                subject: spanTags[3].textContent,
                type: LessonType.division,
              },
              {
                firstAnchor: {
                  link: aTags[3].getAttribute('href'),
                  text: aTags[3].textContent,
                },
                secondAnchor: {
                  link: aTags[4].getAttribute('href'),
                  text: aTags[4].textContent,
                },
                subject: spanTags[5].textContent,
                type: LessonType.division,
              },
            ];
          } else if (spanTags[2].getElementsByTagName('span').length === 0) {
            lessonData = [
              {
                firstAnchor: {
                  link: aTags[0].getAttribute('href'),
                  text: aTags[0].textContent,
                },
                secondAnchor: {
                  link: aTags[1].getAttribute('href'),
                  text: aTags[1].textContent,
                },
                subject: spanTags[1].textContent,
                type: LessonType.division,
              },
              {
                firstAnchor: { text: spanTags[3].textContent },
                secondAnchor: {
                  link: aTags[2].getAttribute('href'),
                  text: aTags[2].textContent,
                },
                subject: spanTags[2].textContent,
                type: LessonType.division,
              },
              {
                firstAnchor: {
                  link: aTags[3].getAttribute('href'),
                  text: aTags[3].textContent,
                },
                secondAnchor: {
                  link: aTags[4].getAttribute('href'),
                  text: aTags[4].textContent,
                },
                subject: spanTags[5].textContent,
                type: LessonType.division,
              },
            ];
          } else if (spanTags[4].getElementsByTagName('span').length === 0) {
            lessonData = [
              {
                firstAnchor: {
                  link: aTags[0].getAttribute('href'),
                  text: aTags[0].textContent,
                },
                secondAnchor: {
                  link: aTags[1].getAttribute('href'),
                  text: aTags[1].textContent,
                },
                subject: spanTags[1].textContent,
                type: LessonType.division,
              },
              {
                firstAnchor: {
                  link: aTags[2].getAttribute('href'),
                  text: aTags[2].textContent,
                },
                secondAnchor: {
                  link: aTags[3].getAttribute('href'),
                  text: aTags[3].textContent,
                },
                subject: spanTags[3].textContent,
                type: LessonType.division,
              },
              {
                firstAnchor: { text: spanTags[5].textContent },
                secondAnchor: {
                  link: aTags[4].getAttribute('href'),
                  text: aTags[4].textContent,
                },
                subject: spanTags[4].textContent,
                type: LessonType.division,
              },
            ];
          }
        } else if (
          spanTags.length === 6 &&
          aTags.length === 4 &&
          pClasses.length === 5 &&
          nClasses.length === 1 &&
          sClasses.length === 3
        ) {
          if (spanTags[0].getElementsByTagName('span').length > 0) {
            lessonData = [
              {
                firstAnchor: {
                  link: aTags[0].getAttribute('href'),
                  text: aTags[0].textContent,
                },
                secondAnchor: {
                  link: aTags[1].getAttribute('href'),
                  text: aTags[1].textContent,
                },
                subject: spanTags[1].textContent,
                type: LessonType.division,
              },
              {
                firstAnchor: { text: spanTags[3].textContent },
                secondAnchor: {
                  link: aTags[2].getAttribute('href'),
                  text: aTags[2].textContent,
                },
                subject: spanTags[2].textContent,
                type: LessonType.division,
              },
              {
                firstAnchor: { text: spanTags[5].textContent },
                secondAnchor: {
                  link: aTags[3].getAttribute('href'),
                  text: aTags[3].textContent,
                },
                subject: spanTags[4].textContent,
                type: LessonType.division,
              },
            ];
          } else if (spanTags[2].getElementsByTagName('span').length > 0) {
            lessonData = [
              {
                firstAnchor: { text: spanTags[1].textContent },
                secondAnchor: {
                  link: aTags[0].getAttribute('href'),
                  text: aTags[0].textContent,
                },
                subject: spanTags[0].textContent,
                type: LessonType.division,
              },
              {
                firstAnchor: {
                  link: aTags[1].getAttribute('href'),
                  text: aTags[1].textContent,
                },
                secondAnchor: {
                  link: aTags[2].getAttribute('href'),
                  text: aTags[2].textContent,
                },
                subject: spanTags[3].textContent,
                type: LessonType.division,
              },
              {
                firstAnchor: { text: spanTags[5].textContent },
                secondAnchor: {
                  link: aTags[3].getAttribute('href'),
                  text: aTags[3].textContent,
                },
                subject: spanTags[4].textContent,
                type: LessonType.division,
              },
            ];
          } else if (spanTags[4].getElementsByTagName('span').length > 0) {
            lessonData = [
              {
                firstAnchor: { text: spanTags[1].textContent },
                secondAnchor: {
                  link: aTags[0].getAttribute('href'),
                  text: aTags[0].textContent,
                },
                subject: spanTags[0].textContent,
                type: LessonType.division,
              },
              {
                firstAnchor: { text: spanTags[3].textContent },
                secondAnchor: {
                  link: aTags[1].getAttribute('href'),
                  text: aTags[1].textContent,
                },
                subject: spanTags[2].textContent,
                type: LessonType.division,
              },
              {
                firstAnchor: {
                  link: aTags[2].getAttribute('href'),
                  text: aTags[2].textContent,
                },
                secondAnchor: {
                  link: aTags[3].getAttribute('href'),
                  text: aTags[3].textContent,
                },
                subject: spanTags[5].textContent,
                type: LessonType.division,
              },
            ];
          }
        } else if (
          spanTags.length === 0 &&
          aTags.length === 0 &&
          pClasses.length === 0 &&
          nClasses.length === 0 &&
          sClasses.length === 0 &&
          lesson.textContent.trim() !== ''
        ) {
          // TODO:
          // lessonData = {
          //   text: lesson.textContent.trim(),
          // };
        }
        if (lesson.textContent.trim() !== '' && lessonData === null) {
          console.error('ERROR');
          console.error(
            spanTags.length,
            aTags.length,
            pClasses.length,
            nClasses.length,
            sClasses.length,
          );
          console.error(lesson.textContent);
        }
      }

      const getKeys = (sectionType: SectionTypes): [AnchorData, AnchorData] => {
        if (sectionType === SectionTypes.class) {
          return [
            { link: 'teacherURL', text: 'teacherName' },
            { link: 'classroomURL', text: 'classroomName' },
          ];
        }
        if (sectionType === SectionTypes.classroom) {
          return [
            { link: 'teacherURL', text: 'teacherName' },
            { link: 'classURL', text: 'className' },
          ];
        }
        if (sectionType === SectionTypes.teacher) {
          return [
            { link: 'classURL', text: 'className' },
            { link: 'classroomURL', text: 'classroomName' },
          ];
        }
      };
      const keys = getKeys(sectionType);

      if (!mappedLessonData && !!lessonData) {
        mappedLessonData = lessonData.map((lesson) => {
          return {
            [keys[0].link]: lesson.firstAnchor.link,
            [keys[0].text]: lesson.firstAnchor.text,
            [keys[1].link]: lesson.secondAnchor.link,
            [keys[1].text]: lesson.secondAnchor.text,
            lessonNumber,
            subject: lesson.subject,
            type: lesson.type,
            weekDay: getWeekDay(),
          };
        });
      }

      if (mappedLessonData) {
        timetables.push(...mappedLessonData);
      }
    });

    return timetables;
  }
}
