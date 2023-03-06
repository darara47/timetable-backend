import { Injectable, Logger } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import { DailyTimetable, LessonData } from 'src/types/lessons.types';

@Injectable()
export class ScrapeDataService {
  private readonly logger = new Logger(ScrapeDataService.name);

  async scrapeClasses(data: string): Promise<any> {
    const dom = new JSDOM(data);
    const document = dom.window.document;
    const table = document.getElementsByTagName('table').item(2);
  }

  async scrapeTimetable(data: string): Promise<{
    monday: DailyTimetable;
    thuesday: DailyTimetable;
    wednesday: DailyTimetable;
    thursday: DailyTimetable;
    friday: DailyTimetable;
  }> {
    const dom = new JSDOM(data);
    const document = dom.window.document;
    const table = document.getElementsByTagName('table').item(2);

    const monday = [];
    const thuesday = [];
    const wednesday = [];
    const thursday = [];
    const friday = [];

    const lessons = Array.from(table.getElementsByClassName('l'));
    lessons.forEach((lesson: Element, index: number) => {
      let lessonData: LessonData = null;

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
          lessonData = {
            common: {
              subject: spanTags[0].textContent,
              teacher: aTags[0].textContent,
              classroom: aTags[1].textContent,
            },
          };
        } else if (
          spanTags.length === 2 &&
          aTags.length === 2 &&
          pClasses.length === 1
        ) {
          lessonData = {
            division: [
              {
                subject: spanTags[1].textContent,
                teacher: aTags[0].textContent,
                classroom: aTags[1].textContent,
              },
            ],
          };
        } else if (
          spanTags.length === 4 &&
          aTags.length === 4 &&
          pClasses.length === 2
        ) {
          lessonData = {
            division: [
              {
                subject: spanTags[1].textContent,
                teacher: aTags[0].textContent,
                classroom: aTags[1].textContent,
              },
              {
                subject: spanTags[3].textContent,
                teacher: aTags[2].textContent,
                classroom: aTags[3].textContent,
              },
            ],
          };
        } else if (
          spanTags.length === 6 &&
          aTags.length === 6 &&
          pClasses.length === 3
        ) {
          lessonData = {
            division: [
              {
                subject: spanTags[1].textContent,
                teacher: aTags[0].textContent,
                classroom: aTags[1].textContent,
              },
              {
                subject: spanTags[3].textContent,
                teacher: aTags[2].textContent,
                classroom: aTags[3].textContent,
              },
              {
                subject: spanTags[5].textContent,
                teacher: aTags[4].textContent,
                classroom: aTags[5].textContent,
              },
            ],
          };
        } else if (
          pClasses.length === 1 &&
          nClasses.length === 1 &&
          sClasses.length === 1
        ) {
          lessonData = {
            common: {
              subject: pClasses[0].textContent,
              teacher: nClasses[0].textContent,
              classroom: sClasses[0].textContent,
            },
          };
        } else if (
          pClasses.length === 2 &&
          nClasses.length === 2 &&
          sClasses.length === 2
        ) {
          lessonData = {
            division: [
              {
                subject: pClasses[0].textContent,
                teacher: nClasses[0].textContent,
                classroom: sClasses[0].textContent,
              },
              {
                subject: pClasses[1].textContent,
                teacher: nClasses[1].textContent,
                classroom: sClasses[1].textContent,
              },
            ],
          };
        } else if (
          pClasses.length === 3 &&
          nClasses.length === 3 &&
          sClasses.length === 3
        ) {
          lessonData = {
            division: [
              {
                subject: pClasses[0].textContent,
                teacher: nClasses[0].textContent,
                classroom: sClasses[0].textContent,
              },
              {
                subject: pClasses[1].textContent,
                teacher: nClasses[1].textContent,
                classroom: sClasses[1].textContent,
              },
              {
                subject: pClasses[2].textContent,
                teacher: nClasses[2].textContent,
                classroom: sClasses[2].textContent,
              },
            ],
          };
        } else if (
          pClasses.length === 4 &&
          nClasses.length === 4 &&
          sClasses.length === 4
        ) {
          lessonData = {
            division: [
              {
                subject: pClasses[0].textContent,
                teacher: nClasses[0].textContent,
                classroom: sClasses[0].textContent,
              },
              {
                subject: pClasses[1].textContent,
                teacher: nClasses[1].textContent,
                classroom: sClasses[1].textContent,
              },
              {
                subject: pClasses[2].textContent,
                teacher: nClasses[2].textContent,
                classroom: sClasses[2].textContent,
              },
              {
                subject: pClasses[3].textContent,
                teacher: nClasses[3].textContent,
                classroom: sClasses[3].textContent,
              },
            ],
          };
        } else if (
          spanTags.length === 2 &&
          aTags.length === 1 &&
          pClasses.length === 2 &&
          nClasses.length === 0 &&
          sClasses.length === 1
        ) {
          lessonData = {
            division: [
              {
                subject: spanTags[0].textContent,
                teacher: spanTags[1].textContent,
                classroom: aTags[0].textContent,
              },
            ],
          };
        } else if (
          spanTags.length === 4 &&
          aTags.length === 3 &&
          pClasses.length === 3 &&
          nClasses.length === 1 &&
          sClasses.length === 2
        ) {
          if (spanTags[0].getElementsByTagName('span').length === 0) {
            lessonData = {
              division: [
                {
                  subject: spanTags[0].textContent,
                  teacher: spanTags[1].textContent,
                  classroom: aTags[0].textContent,
                },
                {
                  subject: spanTags[3].textContent,
                  teacher: aTags[1].textContent,
                  classroom: aTags[2].textContent,
                },
              ],
            };
          } else if (spanTags[2].getElementsByTagName('span').length === 0) {
            lessonData = {
              division: [
                {
                  subject: spanTags[1].textContent,
                  teacher: aTags[0].textContent,
                  classroom: aTags[1].textContent,
                },
                {
                  subject: spanTags[2].textContent,
                  teacher: spanTags[3].textContent,
                  classroom: aTags[2].textContent,
                },
              ],
            };
          }
        } else if (
          spanTags.length === 6 &&
          aTags.length === 5 &&
          pClasses.length === 4 &&
          nClasses.length === 2 &&
          sClasses.length === 3
        ) {
          if (spanTags[0].getElementsByTagName('span').length === 0) {
            lessonData = {
              division: [
                {
                  subject: spanTags[0].textContent,
                  teacher: spanTags[1].textContent,
                  classroom: aTags[0].textContent,
                },
                {
                  subject: spanTags[3].textContent,
                  teacher: aTags[1].textContent,
                  classroom: aTags[2].textContent,
                },
                {
                  subject: spanTags[5].textContent,
                  teacher: aTags[3].textContent,
                  classroom: aTags[4].textContent,
                },
              ],
            };
          } else if (spanTags[2].getElementsByTagName('span').length === 0) {
            lessonData = {
              division: [
                {
                  subject: spanTags[1].textContent,
                  teacher: aTags[0].textContent,
                  classroom: aTags[1].textContent,
                },
                {
                  subject: spanTags[2].textContent,
                  teacher: spanTags[3].textContent,
                  classroom: aTags[2].textContent,
                },
                {
                  subject: spanTags[5].textContent,
                  teacher: aTags[3].textContent,
                  classroom: aTags[4].textContent,
                },
              ],
            };
          } else if (spanTags[4].getElementsByTagName('span').length === 0) {
            lessonData = {
              division: [
                {
                  subject: spanTags[1].textContent,
                  teacher: aTags[0].textContent,
                  classroom: aTags[1].textContent,
                },
                {
                  subject: spanTags[3].textContent,
                  teacher: aTags[2].textContent,
                  classroom: aTags[3].textContent,
                },
                {
                  subject: spanTags[4].textContent,
                  teacher: spanTags[5].textContent,
                  classroom: aTags[4].textContent,
                },
              ],
            };
          }
        } else if (
          spanTags.length === 6 &&
          aTags.length === 4 &&
          pClasses.length === 5 &&
          nClasses.length === 1 &&
          sClasses.length === 3
        ) {
          if (spanTags[0].getElementsByTagName('span').length > 0) {
            lessonData = {
              division: [
                {
                  subject: spanTags[1].textContent,
                  teacher: aTags[0].textContent,
                  classroom: aTags[1].textContent,
                },
                {
                  subject: spanTags[2].textContent,
                  teacher: spanTags[3].textContent,
                  classroom: aTags[2].textContent,
                },
                {
                  subject: spanTags[4].textContent,
                  teacher: spanTags[5].textContent,
                  classroom: aTags[3].textContent,
                },
              ],
            };
          } else if (spanTags[2].getElementsByTagName('span').length > 0) {
            lessonData = {
              division: [
                {
                  subject: spanTags[0].textContent,
                  teacher: spanTags[1].textContent,
                  classroom: aTags[0].textContent,
                },
                {
                  subject: spanTags[3].textContent,
                  teacher: aTags[1].textContent,
                  classroom: aTags[2].textContent,
                },
                {
                  subject: spanTags[4].textContent,
                  teacher: spanTags[5].textContent,
                  classroom: aTags[3].textContent,
                },
              ],
            };
          } else if (spanTags[4].getElementsByTagName('span').length > 0) {
            lessonData = {
              division: [
                {
                  subject: spanTags[0].textContent,
                  teacher: spanTags[1].textContent,
                  classroom: aTags[0].textContent,
                },
                {
                  subject: spanTags[2].textContent,
                  teacher: spanTags[3].textContent,
                  classroom: aTags[1].textContent,
                },
                {
                  subject: spanTags[5].textContent,
                  teacher: aTags[2].textContent,
                  classroom: aTags[3].textContent,
                },
              ],
            };
          }
        } else if (
          spanTags.length === 0 &&
          aTags.length === 0 &&
          pClasses.length === 0 &&
          nClasses.length === 0 &&
          sClasses.length === 0 &&
          lesson.textContent.trim() !== ''
        ) {
          lessonData = {
            text: lesson.textContent.trim(),
          };
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

      if (index % 5 === 0) {
        monday.push(lessonData);
      } else if (index % 5 === 1) {
        thuesday.push(lessonData);
      } else if (index % 5 === 2) {
        wednesday.push(lessonData);
      } else if (index % 5 === 3) {
        thursday.push(lessonData);
      } else if (index % 5 === 4) {
        friday.push(lessonData);
      }
    });
    // console.log(monday);
    // console.log(thuesday);
    // console.log(wednesday);
    // console.log(thursday);
    // console.log(friday);
    return { monday, thuesday, wednesday, thursday, friday };
  }
}
