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
  leaderboardSnapshotStatisticId: number;
  profileStatisticId: number;
  snapshotStatisticId: number;
  statisticsAveragesSnapshotId: number;
  profileStatistic: ProfileStatistic;
}

export interface SnapshotStatistic {
  id: number;
  gamerTagId: number;
  profileSnapshotStatistic: ProfileSnapshotStatistic;
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

