import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Coach, DatabaseSchema } from 'shared-types';

@Injectable()
export class CoachesService {
  private getDatabase(): DatabaseSchema {
    const dbPath = path.join(process.cwd(), '../../db.json');
    const dbContent = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(dbContent) as DatabaseSchema;
  }

  getAllCoaches(): Coach[] {
    const db = this.getDatabase();
    return db.coaches;
  }
}
