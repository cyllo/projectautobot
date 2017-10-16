import { HeroSnapshotStats } from './player.model';

export interface ProfileStatistic {
  competitiveLevel: number;
  competitiveRankUrl: string;
  level: number;
  levelUrl: string;
  rankUrl: string;
  totalGamesWon: number;
}

export interface ProfileSnapshotStatistic {
  id: number;
  leaderboardSnapshotStatisticId?: number;
  profileStatisticId?: number;
  snapshotStatisticId?: number;
  statisticsAveragesSnapshotId?: number;
  profileStatistic: ProfileStatistic;
}

export interface SnapshotStatistic {
  id: number;
  insertedAt: string;
  gamerTagId: number;
  profileSnapshotStatistic: ProfileSnapshotStatistic;
  competitiveHeroesTotalSnapshotStatistic?: HeroSnapshotStats;
  quickPlayHeroesTotalSnapshotStatistic?: HeroSnapshotStats;
}

export interface ProfileKey {
  tag: string;
  platform: string;
  region: string;
}

export interface GamerTagSearchResponse {
  searchGamerTag: GamerTag[];
  loading: boolean;
}

export interface GamerTagFetchResponse {
  gamerTag: GamerTag;
  loading: boolean;
}

export interface GamerTagScrapeResponse {
  scrapeGamerTag: GamerTag;
  loading: boolean;
}

export interface GamerTagState {
  [key: string]: GamerTag;
}

export interface GamerTag {
  id: number;
  insertedAt?: Date;
  updatedAt?: Date;
  overwatchName: string;
  platform: string;
  portraitUrl: string;
  region: string;
  tag: string;
  userId: number;
  snapshotStatistics?: [SnapshotStatistic];
}

export interface FollowingGamerTagState {
  [key: number]: GamerTag;
}

export interface User {
  id: number;
  email: string;
  isAdmin?: boolean;
  displayName: string;
  battleNetId?: number;
  battleNetTag?: string;
  password?: string;
  insertedAt?: Date;
  updatedAt?: Date;
  following?: [User];
  gamerTags?: [GamerTag];
}

export interface FollowingUserState {
  [key: number]: User;
}

export interface Statistic {
  heroesTotalSnapshotStatistic: {
    gameHistoryStatistic: {
      winPercentage: number;
    };
  };
}

export interface StatChangeResponse {
  gamerTag: {
    currentStatistics: Statistic[];
    pastStatistics: Statistic[];
  };
}
