import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class QueryRunnerSource {
  constructor(private readonly dataSource: DataSource) {}

  async create(): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();
    return queryRunner;
  }
}
