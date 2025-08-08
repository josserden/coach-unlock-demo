import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Coach, DatabaseSchema, UnlockHistory } from 'shared-types';

@Injectable()
export class CoachesService {
  getAllCoaches(): Coach[] {
    const db = this.getDatabase();
    return db.coaches;
  }

  getUser(userId: string) {
    const db = this.getDatabase();
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  unlockCoach(userId: string, coachId: string) {
    const db = this.getDatabase();

    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const coach = db.coaches.find((c) => c.id === coachId);
    if (!coach) {
      throw new NotFoundException('Coach not found');
    }

    if (!coach.available) {
      throw new BadRequestException('Coach is not available');
    }

    if (user.unlockedCoaches.includes(coachId)) {
      throw new BadRequestException('Coach already unlocked');
    }

    if (user.tokens < coach.unlockCost) {
      throw new BadRequestException('Insufficient tokens');
    }

    user.tokens -= coach.unlockCost;
    user.xp += db.gameConfig.xpPerUnlock;
    user.unlockedCoaches.push(coachId);

    const unlockRecord: UnlockHistory = {
      id: this.generateId(),
      userId,
      coachId,
      timestamp: new Date().toISOString(),
      tokensSpent: coach.unlockCost,
      xpGained: db.gameConfig.xpPerUnlock,
      hasRedFlag: coach.hasRedFlag,
    };

    db.unlockHistory.push(unlockRecord);

    this.saveDatabase(db);

    return {
      success: true,
      updatedUser: user,
      coach: coach,
      showRedFlagWarning: coach.hasRedFlag,
    };
  }

  private getDbPath(): string {
    return path.join(process.cwd(), '../../db.json');
  }

  private getDatabase(): DatabaseSchema {
    const dbPath = this.getDbPath();
    const dbContent = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(dbContent) as DatabaseSchema;
  }

  private saveDatabase(db: DatabaseSchema): void {
    const dbPath = this.getDbPath();
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
