import { AppState } from './appstate.model';

export interface Player extends AppState {
  id?: number;
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
  competitive: TransformedStats;
  quickPlay: TransformedStats;
}

export interface TransformedStats {
  heroSnapshotStatistics: HeroSnapshotStats[];
  heroesTotalSnapshotStatistic: HeroSnapshotStats;
}

export interface SnapshotStats {
  updatedAt: string;
  insertedAt: string;
  id?: number;
  gamerTagId: number;
  profileSnapshotStatistic: ProfileSnapshotStats;
  quickplayHeroSnapshotStatistics: HeroSnapshotStats[];
  competitiveHeroSnapshotStatistics: HeroSnapshotStats[];
  quickplayHeroesTotalSnapshotStatistic: HeroSnapshotStats;
  competitiveHeroesTotalSnapshotStatistic: HeroSnapshotStats;
}

export interface HeroSpecificStats {
  id: number;
  stats: any;
}

export interface ProfileSnapshotStats {
  profileStatistic: ProfileStats;
  leaderboardSnapshotStatistic: LeaderboardSnapshotStats;
}

export interface ProfileStats {
  level: number;
  competitiveLevel: number;
  totalGamesWon: number;
  levelUrl: string;
  rankUrl: string;
  competitiveRankUrl: string;
}

export interface LeaderboardSnapshotStats {
  profileStatRankings: ProfileStatRankings;
  heroQuickplayRankings: HeroRankings;
  heroCompetitiveRankings: HeroRankings;
  heroTotalQuickplayRankings: GameplayRankings;
  heroTotalCompetitiveRankings: GameplayRankings;
}

export interface ProfileStatRankings {
  totalGamesWon: Rankings;
  level: Rankings;
  competitiveLevel: Rankings;
}

export interface HeroRankings {
  [heroId: string]: GameplayRankings;
}

export interface GameplayRankings {
  allDamageDoneAvgPer10Min: Rankings;
  allDamageDoneMostInGame: Rankings;
  bronzeMedals: Rankings;
  cards: Rankings;
  criticalHits: Rankings;
  criticalHitsAccuracyPercentage: Rankings;
  criticalHitsAverage: Rankings;
  criticalHitsMostInGame: Rankings;
  criticalHitsMostInLife: Rankings;
  damageBlocked: Rankings;
  damageBlockedAverage: Rankings;
  damageBlockedMostInGame: Rankings;
  damageDone: Rankings;
  damageDoneAverage: Rankings;
  damageDoneMostInGame: Rankings;
  damageDoneMostInLife: Rankings;
  deaths: Rankings;
  deathsAverage: Rankings;
  defensiveAssists: Rankings;
  defensiveAssistsAverage: Rankings;
  defensiveAssistsMostInGame: Rankings;
  eliminations: Rankings;
  eliminationsAverage: Rankings;
  eliminationsMostInGame: Rankings;
  eliminationsMostInLife: Rankings;
  eliminationsPerLife: Rankings;
  environmentalDeaths: Rankings;
  environmentalKills: Rankings;
  environmentalKillsMostInGame: Rankings;
  finalBlows: Rankings;
  finalBlowsAverage: Rankings;
  finalBlowsMostInGame: Rankings;
  gamesLost: Rankings;
  gamesPlayed: Rankings;
  gamesTied: Rankings;
  gamesWon: Rankings;
  goldMedals: Rankings;
  healingDone: Rankings;
  healingDoneAverage: Rankings;
  healingDoneMostInGame: Rankings;
  healingDoneMostInLife: Rankings;
  killStreakBest: Rankings;
  meleeFinalBlows: Rankings;
  meleeFinalBlowsAverage: Rankings;
  meleeFinalBlowsMostInGame: Rankings;
  meleeKills: Rankings;
  meleeKillsAverage: Rankings;
  meleeKillsMostInGame: Rankings;
  multikillBest: Rankings;
  multikills: Rankings;
  objectiveKills: Rankings;
  objectiveKillsAverage: Rankings;
  objectiveKillsMostInGame: Rankings;
  objectiveTime: Rankings;
  objectiveTimeAverage: Rankings;
  objectiveTimeMostInGame: Rankings;
  offensiveAssists: Rankings;
  offensiveAssistsAverage: Rankings;
  offensiveAssistsMostInGame: Rankings;
  reconAssists: Rankings;
  reconAssistsMostInGame: Rankings;
  selfHealingAverage: Rankings;
  selfHealingMostInGame: Rankings;
  shotsFired: Rankings;
  shotsHit: Rankings;
  silverMedals: Rankings;
  soloKills: Rankings;
  soloKillsAverage: Rankings;
  soloKillsMostInGame: Rankings;
  teleporterPadsDestroyed: Rankings;
  timePlayed: Rankings;
  timeSpentOnFire: Rankings;
  timeSpentOnFireAverage: Rankings;
  timeSpentOnFireMostInGame: Rankings;
  totalMedals: Rankings;
  turretsDestroyed: Rankings;
  turretsDestroyedMostInGame: Rankings;
  weaponAccuracyBestInGamePercentage: Rankings;
  weaponAccuracyPercentage: Rankings;
  winPercentage: Rankings;
}

export interface Rankings {
  [gamerTagId: string]: Ranking;
}

export interface Ranking {
  value: number;
  rank: number;
}

export interface HeroSnapshotStats {
  snapshotStatisticId: number;
  matchAwardsStatisticId: number;
  matchAwardsStatistic: MatchAwardsStats;
  id?: number;
  statisticType: string;
  heroSpecificStatistic: HeroSpecificStats;
  heroSpecificStatisticId: number;
  heroId: number;
  hero: Hero;
  gameHistoryStatisticId: number;
  gameHistoryStatistic: GameHistoryStats;
  combatLifetimeStatisticId: number;
  combatLifetimeStatistic: CombatLifetimeStats;
  combatBestStatisticId: number;
  combatBestStatistic: CombatBestStats;
  combatAverageStatisticId: number;
}

export interface MatchAwardsStats {
  totalMedals: number;
  silverMedals: number;
  id?: number;
  goldMedals: number;
  cards: number;
  bronzeMedals: number;
}

export interface Hero {
  updatedAt: string;
  name: string;
  insertedAt: string;
  id?: number;
  code: string;
}

export interface GameHistoryStats {
  winPercentage: string;
  timeSpentOnFire: number;
  timePlayed: number;
  id?: number;
  gamesWon: number;
  gamesPlayed: number;
  gamesLost: number;
}

export interface CombatLifetimeStats {
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

export interface CombatBestStats {
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
  id?: number;
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

export interface CurrentHero {
  heroSnapshotStatistics?: HeroSnapshotStats;
  matchAwardsStatistic?: MatchAwardsStats;
  hero?: Hero;
  gameHistoryStatistic?: GameHistoryStats;
  combatLifetimeStatistic?: CombatLifetimeStats;
  combatBestStatistic?: CombatBestStats;
}
