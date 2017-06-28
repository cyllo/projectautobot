export interface HeroSkill {
  name: string;
  isUltimateAbility: boolean;
  iconUrl: string;
  description: string;
}

export interface HeroData {
  code: string;
  name: string;
  portraitUrl: string;
  description: string;
  role: number;
  synergy: string[];
  counter: string[];
  skills: HeroSkill[];
}

export interface HeroRole {
  name: string;
  id: number;
  iconUrl: string;
}

export interface OverwatchStaticData {
  roles: HeroRole[];
  heroes: HeroData[];
}

export interface HeroStatBlock {
  name: string;
  value?: number;
  format?: string;
  percent?: number;
}
