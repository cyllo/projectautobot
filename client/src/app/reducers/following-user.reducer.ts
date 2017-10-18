import { dissoc, assoc } from 'ramda';
import { User } from '../models';

export interface FollowingUserState {
  [key: number]: User;
}

export function followedUsers(state: FollowingUserState = {}, { type, payload }: {type: string, payload?: any|any[] }) {
  switch (type) {
    case 'LIST_FOLLOWING':
      return payload.reduce((acc, item) => Object.assign(acc, {[item.id]: item}), {});
    case 'UNFOLLOW':
      return dissoc(payload, state);
    case 'FOLLOW':
      return assoc(payload.id, payload, state);
    default:
      return state;
  }
}

export function listFollowedUsers(users: User[]) {
  return { type: 'LIST_FOLLOWING', payload: users };
}

export function unfollowUser(userId: number) {
  return { type: 'UNFOLLOW', payload: userId };
}

export function followUser(user: User) {
  return { type: 'FOLLOW', payload: user };
}
