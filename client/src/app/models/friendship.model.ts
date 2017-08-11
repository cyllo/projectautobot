import { User } from './user.model';

export interface FriendShip {
    id?: number;
    insertedAt?: Date;
    isAccepted?: boolean;
    user?: User;
}

export interface FriendShipState {
  [key: number]: FriendShip;
}
