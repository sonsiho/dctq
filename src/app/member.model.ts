export type FactionKey = 'shu' | 'wu' | 'wei' | 'qun';

export type NumericMemberKey =
  | 'gemLimitGold'
  | 'gemLimitPurple'
  | 'gemNormalGold'
  | 'gemNormalPurple'
  | 'gearHp'
  | 'gearAtk'
  | 'resistShu'
  | 'resistWu'
  | 'resistWei'
  | 'resistQun'
  | 'slayShu'
  | 'slayWu'
  | 'slayWei'
  | 'slayQun'
  | 'powerScore';

export interface Member {
  id: string;
  registeredAt: string;
  zaloName: string;
  gameName: string;
  gameId: string;
  gemLimitGold: number;
  gemLimitPurple: number;
  gemNormalGold: number;
  gemNormalPurple: number;
  gearHp: number;
  gearAtk: number;
  resistShu: number;
  resistWu: number;
  resistWei: number;
  resistQun: number;
  slayShu: number;
  slayWu: number;
  slayWei: number;
  slayQun: number;
  powerScore: number;
}

export interface Faction {
  key: FactionKey;
  label: string;
  shortLabel: string;
  resistKey: NumericMemberKey;
  slayKey: NumericMemberKey;
}

export interface DataLoadResult {
  members: Member[];
  source: 'firestore' | 'local' | 'sample';
  message: string;
}

export interface SaveMemberResult {
  member: Member;
  source: 'firestore' | 'local';
  message: string;
}

