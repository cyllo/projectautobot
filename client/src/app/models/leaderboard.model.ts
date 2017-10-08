import { Rankings } from './player.model';

export interface LeaderboardSnapshotStatistic {
  profileStatsRankings: ProfileStatRanking;
}

export interface ProfileStatRanking {
  totalGamesWon: Rankings;
  level: Rankings;
  competitiveLevel: Rankings;
}

interface Hero {
  code: string;
  name: string;
}

interface CompetitiveSkillRating {
  rankUrl: string;
  rank: number;
}

interface Player {
  tag: string;
  avatarUrl: string;
}

export interface PlayerLeaderboardDataEntry {
  position: number;
  platform: string;
  region: string;
  player: Player;
  level: number;
  competitiveRating: CompetitiveSkillRating;
  timeOnFire: number;
  kdRatio: number;
  wins: number;
  lost: number;
  winRate: number;
  timePlayed: number;
  mostPlayedHeroes: Hero[];
}
