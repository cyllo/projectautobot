import { Friendship } from './friendship.model';

export interface Club {
  id: number;
  name: string;
  insertedAt: Date;
  updatedAt: Date;
  friendships: [Friendship];
}

export interface ClubState {
  [key: number]: Club;
}
