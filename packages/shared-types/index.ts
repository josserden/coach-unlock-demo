export interface Coach {
  id: string;
  name: string;
  position: string;
  school: string;
  available: boolean;
  hasRedFlag: boolean;
  redFlagReason?: string;
  unlockCost: number;
}

export interface User {
  id: string;
  name: string;
  tokens: number;
  xp: number;
  unlockedCoaches: string[];
}

export interface UnlockHistory {
  id: string;
  userId: string;
  coachId: string;
  timestamp: string;
  tokensSpent: number;
  xpGained: number;
  hasRedFlag: boolean;
}

export interface GameConfig {
  xpPerUnlock: number;
  tokenCostPerUnlock: number;
}

export interface DatabaseSchema {
  users: User[];
  coaches: Coach[];
  unlockHistory: UnlockHistory[];
  gameConfig: GameConfig;
}
