import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';

@Injectable()
export class ExternalApiService {
  constructor(private readonly httpService: HttpService) {}
  private readonly logger = new Logger(ExternalApiService.name);

  async getSections(): Promise<string> {
    const apiUrl = `https://www.zstrybnik.pl/html/lista.html`;
    const sectionsData = await this.getData(apiUrl);

    return sectionsData;
  }

  async getLesson(url: string): Promise<string> {
    const apiUrl = `https://www.zstrybnik.pl/html/${url}`;
    const lessonData = await this.getData(apiUrl);

    return lessonData;
  }

  private async getData(apiUrl: string): Promise<string> {
    const { data, status }: { data: string; status: number } =
      await firstValueFrom(
        this.httpService
          .get(apiUrl, {
            headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error.response.data);
              throw 'An error happened!';
            }),
          ),
      );

    if (status !== 200) {
      throw Error(`STATUS: ${status}; DATA: ${JSON.stringify(data)}`);
    }

    return data;
  }
}
