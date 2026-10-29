import { ItemDefinition, PlayerProfile, Contract } from '../types';

export const ALL_ITEMS: ItemDefinition[] = [
  { id: 'scrap_metal', name: 'Scrap Metal', category: 'scrap', rarity: 'Common', value: 8, description: 'Resilient industrial alloy salvageable at the workshop.' },
  { id: 'copper_wire', name: 'Copper Wiring', category: 'scrap', rarity: 'Common', value: 12, description: 'Stripped electrical cabling. Essential for basic repairs.' },
  { id: 'circuit_board', name: 'Damaged PCB', category: 'component', rarity: 'Uncommon', value: 35, description: 'Intact micro-circuits salvaged from central terminals.' },
  { id: 'power_cell', name: 'Core Battery Cell', category: 'component', rarity: 'Uncommon', value: 50, description: 'Pressurized energy core with residual charge.' },
  { id: 'signal_lens', name: 'Prismatic Lens', category: 'artifact', rarity: 'Rare', value: 120, description: 'Unidentified optical crystal refracting light into strange spectra.' },
  { id: 'cracked_compass', name: 'Magnetic Anomaly Compass', category: 'artifact', rarity: 'Rare', value: 150, description: 'Needle spins erratically pointing toward underground sectors.' },
  { id: 'echo_cassette', name: 'Audio Log #409', category: 'artifact', rarity: 'Epic', value: 280, description: 'Magnetic tape recording pre-lockdown evacuation warnings.' },
  { id: 'warden_core', name: 'Warden Actuator Fragment', category: 'artifact', rarity: 'Anomalous', value: 650, description: 'Heavy mechanical plating harvested from a dormant patrol automaton.' },
];

export const CONTRACTS: Contract[] = [
  {
    id: 'contract_1',
    title: 'Industrial Scrap Run',
    description: 'Recover 3 pieces of scrap or copper wiring from the district.',
    targetCategory: 'scrap',
    targetCount: 3,
    rewardCredits: 100,
    completed: false,
  },
  {
    id: 'contract_2',
    title: 'Power Station Salvage',
    description: 'Secure 2 electronic components or batteries.',
    targetCategory: 'component',
    targetCount: 2,
    rewardCredits: 175,
    completed: false,
  },
  {
    id: 'contract_3',
    title: 'Anomalous Recovery',
    description: 'Extract with at least 1 rare Artifact from the district.',
    targetCategory: 'artifact',
    targetCount: 1,
    rewardCredits: 300,
    completed: false,
  },
];

const PROFILE_STORAGE_KEY = 'loot_shift_lockdown_profile_v1';

export function loadProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return {
        credits: data.credits ?? 150,
        upgrades: {
          satchel: data.upgrades?.satchel ?? 0,
          scanner: data.upgrades?.scanner ?? 0,
          flashlight: data.upgrades?.flashlight ?? 0,
        },
        collection: data.collection ?? [],
        statistics: {
          runsStarted: data.statistics?.runsStarted ?? 0,
          runsExtracted: data.statistics?.runsExtracted ?? 0,
          runsFailed: data.statistics?.runsFailed ?? 0,
          artifactsExtracted: data.statistics?.artifactsExtracted ?? 0,
          totalCreditsEarned: data.statistics?.totalCreditsEarned ?? 150,
        },
        settings: {
          masterVolume: data.settings?.masterVolume ?? 0.8,
          musicVolume: data.settings?.musicVolume ?? 0.7,
          sfxVolume: data.settings?.sfxVolume ?? 0.8,
          reducedShake: data.settings?.reducedShake ?? false,
        },
      };
    }
  } catch (e) {
    console.error('Failed to load profile', e);
  }

  return {
    credits: 150,
    upgrades: { satchel: 0, scanner: 0, flashlight: 0 },
    collection: [],
    statistics: { runsStarted: 0, runsExtracted: 0, runsFailed: 0, artifactsExtracted: 0, totalCreditsEarned: 150 },
    settings: { masterVolume: 0.8, musicVolume: 0.7, sfxVolume: 0.8, reducedShake: false },
  };
}

export function saveProfile(profile: PlayerProfile) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function getSatchelCapacity(satchelLevel: number): number {
  switch (satchelLevel) {
    case 0: return 8;
    case 1: return 10;
    case 2: return 12;
    case 3: return 15;
    default: return 8;
  }
}

export function getUpgradeCost(type: 'satchel' | 'scanner' | 'flashlight', currentLevel: number): number {
  if (type === 'satchel') {
    if (currentLevel === 0) return 300;
    if (currentLevel === 1) return 700;
    if (currentLevel === 2) return 1500;
  } else if (type === 'scanner') {
    if (currentLevel === 0) return 400;
    if (currentLevel === 1) return 900;
  } else if (type === 'flashlight') {
    if (currentLevel === 0) return 250;
    if (currentLevel === 1) return 600;
  }
  return 99999;
}
