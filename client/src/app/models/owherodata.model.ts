export interface HeroSkill {
  name: String;
  isUltimateAbility: Boolean;
  iconUrl: String;
  description: String;
}

export interface HeroData {
  code: String;
  name: String;
  portraitUrl: String;
  description: String;
  role: Number;
  synergy: String[];
  counter: String[];
  skills: HeroSkill[];
}

export interface HeroRole {
  name: String;
  id: Number;
  iconUrl: String;
}

export interface OverwatchStaticData {
  roles: HeroRole[];
  heroes: HeroData[];
}
