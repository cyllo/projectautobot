import { assocPath, dissoc, reduce, replace, prop, has, reject, propEq, compose, not, isEmpty } from 'ramda';
import { GamerTag, GamerTagState } from '../models';

const notEmpty = compose(not, isEmpty);

export function profiles(state: any = {}, { type, payload }: { type: string, payload?: any }) {
  switch (type) {
    case 'ADD_PROFILES':
      return reduce((acc, player: GamerTag) => {
        return addProfileToStore(player, acc);
      }, state, payload);

    case 'ADD_PROFILE':
      return addProfileToStore(payload, state);

    case 'UPDATE_PROFILE':
      return addProfileToStore(payload, state);

    case 'REMOVE_PROFILE':
      return dissoc(payload.tag, state);

    default:
      return state;
  }
}

export function addProfiles(profileList: GamerTag[]) {
  return { type: 'ADD_PROFILES', payload: profileList };
}

export function addProfile(profile: GamerTag) {
  return { type: 'ADD_PROFILE', payload: profile };
}

export function updateProfile(profile: GamerTag) {
  return { type: 'UPDATE_PROFILE', payload: profile};
}

export function removeProfile(tag: String) {
  return { type: 'REMOVE_PROFILE', payload: tag};
}


function getProfileKey({ tag, platform, region}) {
  const cleanTag = replace('#', '-', tag);
  return platform === 'pc'
  ? [cleanTag, platform, region]
  : [cleanTag, platform];
}

function addPlayer(player: GamerTag, state) {
  return player ? assocPath(getProfileKey(player), player, state) : state;
}

function addConnectedProfiles(originalProfile: GamerTag, connectedProfiles: GamerTag[], state: GamerTagState) {
  const updatedState: GamerTagState = reduce((accum, profile: GamerTag) => {
    const profileKey = { tag: prop('tag', originalProfile), platform: profile.platform, region: profile.region };
    return assocPath(getProfileKey(profileKey), profile, accum);
  }, addPlayer(originalProfile, state), connectedProfiles);

  const [nextProfile, ...remainingProfiles] = connectedProfiles;

  if (has(replace('#', '-', <string>prop('tag', nextProfile)), updatedState)) {
    return updatedState;
  }

  const connectedTags: GamerTag[] = [
    ...reject(propEq('id', originalProfile.id), remainingProfiles),
    dissoc('connectedGamerTags', originalProfile)
  ];

  return addConnectedProfiles(nextProfile, connectedTags, updatedState);
}

function addProfileToStore(profile, state) {

  const connectedTags = <GamerTag[]>prop('connectedGamerTags', profile);

  if (notEmpty(connectedTags)) {
    return addConnectedProfiles(profile, connectedTags, state);
  }

  return addPlayer(profile, state);
}
