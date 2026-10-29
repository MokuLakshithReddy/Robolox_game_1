export type GamePhase = 'title' | 'workshop' | 'expedition' | 'debrief' | 'gameover';

export interface ItemDefinition {
  id: string;
  name: string;
  category: 'scrap' | 'component' | 'artifact' | 'evidence';
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Anomalous';
  value: number;
  description: string;
}

export interface InventoryItem {
  id: string; // instance id
  definitionId: string;
  quantity: number;
}

export interface PlayerProfile {
  credits: number;
  upgrades: {
    satchel: number; // level 0-3 (cap 8 -> 10 -> 12 -> 15 slots)
    scanner: number; // level 0-2
    flashlight: number; // level 0-2
  };
  collection: string[]; // unlocked artifact definition ids
  statistics: {
    runsStarted: number;
    runsExtracted: number;
    runsFailed: number;
    artifactsExtracted: number;
    totalCreditsEarned: number;
  };
  settings: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    reducedShake: boolean;
  };
}

export interface Contract {
  id: string;
  title: string;
  description: string;
  targetCategory?: string;
  targetCount: number;
  rewardCredits: number;
  completed: boolean;
}

export interface ExpeditionState {
  runId: string;
  phase: 'exploring' | 'lockdown' | 'extracted' | 'failed';
  timeRemaining: number; // seconds
  districtName: string;
  hazard: 'none' | 'blackout' | 'toxic_fog' | 'surge';
  inventory: InventoryItem[];
  maxSlots: number;
  contract: Contract;
  contractProgress: number;
  securedHaul: InventoryItem[];
  earnedCredits: number;
  newArtifactsFound: string[];
}
