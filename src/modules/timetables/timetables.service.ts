import { Injectable } from '@nestjs/common';
import { ExternalApiService } from '../external-api/external-api.service';
import { ScrapeDataService } from '../scrape-data/scrape-data.service';

@Injectable()
export class TimetablesService {
  constructor(
    private readonly externalApiService: ExternalApiService,
    private readonly scrapeDataService: ScrapeDataService,
  ) {}

  async getTimetable() {
    for (let i = 1; i <= 1; i++) {
      const url = `plany/o${i}.html`;
      const dataAsHtmlString = await this.externalApiService.getTimetable(url);
      const scrapeData = await this.scrapeDataService.scrapeTimetable(
        dataAsHtmlString,
      );
      console.log(JSON.stringify(scrapeData));
    }
  }

  // @Cron(CronExpression.EVERY_DAY_AT_1AM)
  // async checkCurrenciesRates() {
  //   for (let i = 1; i <= 54; i++) {
  //     const data = await this.getDataFromExternalApi(i);
  //     await this.scrape(data);
  //   }
  // }
}
