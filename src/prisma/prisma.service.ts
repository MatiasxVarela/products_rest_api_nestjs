import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';
import { EnvironmentVariables } from '../config/env.validation';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService<EnvironmentVariables, true>) {
    super({
      adapter: new PrismaMariaDb(config.get('DATABASE_URL', { infer: true })),
    });
  }
}
