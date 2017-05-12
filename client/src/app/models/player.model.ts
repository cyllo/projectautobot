import { AppState } from './appstate.model';

export interface Player extends AppState{
  id: number;
  updatedAt: string;
  totalGamesWon: number;
  tag: string;
  snapshotStatistics: Array<SnapshotStats>;
  region: string;
  portraitUrl: string;
  platform: string;
  overwatchName: string;
  levelUrl: string;
  level: number;
  insertedAt: string;
  competitiveRankUrl: string;
  competitiveLevel: number;
}

export interface SnapshotStats extends Player {
  updatedAt: string;
  isCompetitive: boolean;
  insertedAt: string;
  id: number;
  heroSnapshotStatistics: HeroSnapshotStats[];
  gamerTagId: number;
  allHeroesSnapshotStatistics: HeroSnapshotStats;
}

export interface HeroSnapshotStats extends SnapshotStats {
  snapshotStatisticId: number;
  matchAwardsStatisticId: number;
  matchAwardsStatistics: MatchAwardsStats;
  id: number;
  heroSpecificStatisticId: number;
  heroId: number;
  hero: Hero;
  gameHistoryStatisticId: number;
  gameHistoryStatistics: GameHistoryStats;
  combatLifetimeStatisticId: number;
  combatLifetimeStatistics: CombatLifetimeStats;
  combatBestStatisticId: number;
  combatBestStatistics: CombatBestStats;
  combatAverageStatisticId: number;
  combatAverageStatistics: CombatAverageStats;
}

export interface MatchAwardsStats extends HeroSnapshotStats {
  totalMedals: number;
  silverMedals: number;
  id: number;
  goldMedals: number;
  cards: number;
  bronzeMedals: number;
}

export interface Hero extends HeroSnapshotStats {
  updatedAt: string;
  name: string;
  insertedAt: string;
  id: number;
  code: string;
}

export interface GameHistoryStats extends HeroSnapshotStats {
  winPercentage: string;
  timeSpentOnFire: number;
  timePlayed: number;
  id: number;
  gamesWon: number;
  gamesPlayed: number;
  gamesLost: number;
}

export interface CombatLifetimeStats extends HeroSnapshotStats {
  weaponAccuracyPercentage: number;
  turretsDestroyed: number;
  timeSpentOnFire: number;
  teleporterPadsDestroyed: number;
  soloKills: number;
  shotsHit: number;
  shotsFired: number;
  reconAssists: number;
  offensiveAssists: number;
  objectiveTime: number;
  objectiveKills: number;
  multikills: number;
  multikillBest: number;
  meleeKills: number;
  meleeFinalBlows: number;
  id: number;
  healingDone: number;
  finalBlows: number;
  environmentalKills: number;
  environmentalDeaths: number;
  eliminationsPerLife: string;
  eliminations: number;
  defensiveAssists: number;
  deaths: number;
  damageDone: number;
  damageBlocked: number;
  criticalHitsPerMinute: number;
  criticalHitsAccuracyPercentage: number;
  criticalHits: number;
  criticalHitAccuracy: number;
}

export interface CombatBestStats extends HeroSnapshotStats {
  weaponAccuracyBestInGamePercentage: number;
  timeSpentOnFireMostInGame: number;
  soloKillsMostInGame: number;
  selfHealingMostInGame: number;
  reconAssistsMostInGame: number;
  offensiveAssistsMostInGame: number;
  objectiveTimeMostInGame: number;
  objectiveKillsMostInGame: number;
  multikillBest: number;
  meleeKillsMostInGame: number;
  meleeFinalBlowsMostInLife: number;
  meleeFinalBlowsMostInGame: number;
  killStreakBest: number;
  id: number;
  healingDoneMostInLife: number;
  healingDoneMostInGame: number;
  finalBlowsMostInGame: number;
  eliminationsMostInLife: number;
  eliminationsMostInGame: number;
  defensiveAssistsMostInGame: number;
  damageDoneMostInLife: number;
  damageDoneMostInGame: number;
  damageBlockedMostInGame: number;
  criticalHitsMostInLife: number;
  criticalHitsMostInGame: number;
}

export interface CombatAverageStats extends HeroSnapshotStats {
  timeSpentOnFireAverage: number;
  soloKillsAverage: string;
  selfHealingAverage: string;
  offensiveAssistsAverage: string;
  objectiveTimeAverage: number;
  objectiveKillsAverage: string;
  meleeKillsAverage: string;
  meleeFinalBlowsAverage: string;
  id: number;
  healingDoneAverage: string;
  finalBlowsAverage: string;
  eliminationsAverage: string;
  defensiveAssistsAverage: string;
  deathsAverage: string;
  damageDoneAverage: string;
  damageBlockedAverage: string;
  criticalHitsAveragePercentage: string;
}
