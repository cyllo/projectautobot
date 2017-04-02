export interface PlayerData {
  totalGamesWon: number;
  quickPlay: QuickPlay;
  portraitUrl: Array<string>;
  overwatchName: string;
  levelUrl: Array<string>;
  level: string;
  gamerTag: string;
  competitiveRankUrl: Array<string>;
  competitiveLevel: string;
  competitive: Competitive;
}

export interface QuickPlay extends PlayerData {
  heroesStats: HeroStats[];
}

export interface Competitive extends PlayerData {
  heroesStats: HeroStats[];
}

export interface HeroStats extends QuickPlay {
  stats: Stats;
  name: string;
  code: string;
}

export interface Stats extends HeroStats {
  matchAwards: MatchAwards;
  lifetime: LifetimeStats;
  heroSpecific: HeroSpecific;
  game: Game;
  best: Best;
  average: Average;
}

export interface MatchAwards extends Stats {
  medalsSilver: number;
  medalsGold: number;
  medalsBronze: number;
  medals: number;
  cards: number;
}

export interface LifetimeStats extends Stats {
  timeSpentOnFire: number;
  soloKills: number;
  objectiveTime: number;
  objectiveKills: number;
  healingDone: number;
  finalBlows: number;
  eliminationsPerLife: number;
  eliminations: number;
  deaths: number;
  damageDone: number;
}

export interface HeroSpecific extends Stats {
  weaponAccuracyBestInGame: string;
  weaponAccuracy: string;
  turretsDestroyed: number;
  soulsConsumedMostInGame: number;
  soulsConsumedAverage: number;
  soulsConsumed: number;
  shotsHit: number;
  shotsFired: number;
  selfHealingMostInGame: number;
  selfHealing: number;
  multikill: number;
  meleeFinalBlowMostInGame: number;
  meleeFinalBlow: number;
  healingDoneMostInLife: number;
  healingDoneAverage: number;
  environmentalDeath: number;
  eliminationsMostInLife: number;
  deathBlossomKillsMostInGame: number;
  deathBlossomKillsAverage: number;
  deathBlossomKills: number;
  damageDoneMostInLife: number;
  criticalHitsMostInLife: number;
  criticalHitsMostInGame: number;
  criticalHitsAverage: number;
  criticalHits: number;
  criticalHitAccuracy: string;
}

export interface Game extends Stats {
  timePlayed: number;
  gamesWon: number;
}

export interface Best extends Stats {
  soloKillsMostInGame: number;
  objectiveTimeMostInGame: number;
  objectiveKillsMostInGame: number;
  multikillBest: number;
  killStreakBest: number;
  healingDoneMostInGame: number;
  finalBlowsDoneMostInGame: number;
  eliminationsMostInGame: number;
  damageDoneMostInGame: number;
}

export interface Average extends Stats {
  timeSpentOnFireAverage: number;
  soloKillsAverage: number;
  selfHealingAverage: number;
  objectiveTimeAverage: number;
  objectiveKillsAverage: number;
  meleeFinalBlowsAverage: number;
  finalBlowsAverage: number;
  eliminationsAverage: number;
  deathsAverage: number;
  damageDoneAverage: number;
}
