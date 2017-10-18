import { dissoc, assoc } from 'ramda';
import { GamerTag } from '../models';

export interface FollowingGamerTagState {
  [key: number]: GamerTag;
}

export function followedGamerTags(state: FollowingGamerTagState = {}, { type, payload }: {type: string, payload?: any|any[] }) {
  switch (type) {
    case 'LIST_FOLLOWED_GAMERTAGS':
      return payload.reduce((acc, item) => Object.assign(acc, {[item.id]: item}), {});
    case 'UNFOLLOW_GAMERTAG':
      return dissoc(payload, state);
    case 'FOLLOW_GAMERTAG':
      return assoc(payload.id, payload, state);
    default:
      return state;
  }
}

export function listFollowedGamerTags(gamerTags: GamerTag[]) {
  return { type: 'LIST_FOLLOWED_GAMERTAGS', payload: gamerTags };
}

export function unfollowGamerTag(gamertagId: number) {
  return { type: 'UNFOLLOW_GAMERTAG', payload: gamertagId };
}

export function followGamerTag(user: GamerTag) {
  return { type: 'FOLLOW_GAMERTAG', payload: user };
}
