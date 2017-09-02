import { ClubState, Club } from '../models';
import { dissoc, assoc, propEq, reject, map, values, find } from 'ramda';

const removeClubFriendship = (friendshipId, club) => {
  return assoc('friendships', reject(propEq('id', friendshipId), club.friendships), club);
};


export function clubs(state: ClubState = {}, { type, payload }: { type: string, payload?: any | any[] }) {
  switch (type) {
    case 'GET_CLUBS':
      return payload.reduce((acc, item) => Object.assign(acc, {
        [item.id]: item
      }), {});
    case 'CREATE_CLUB':
      return {
        ...state,
        [payload.id]: payload
      };
    case 'REMOVE_CLUB':
      return dissoc(payload, state); // note: the payload should be the ID of the club
    case 'UPDATE_CLUB':
      return assoc(payload.id, payload, state);
    case 'ADD_FRIENDSHIP':
      const { friendship, clubId } = payload;
      const add = (ship, club) => assoc('friendships', [...club.friendships, ship], club);

      return assoc(clubId, add(friendship, state[clubId]), state);
    case 'REMOVE_FRIENDSHIP':
      const { friendshipId, clubId: id } = payload;

      return assoc(id, removeClubFriendship(friendshipId, state[id]), state);
    case 'DELETE_FRIENDSHIP':
      return map(club => removeClubFriendship(payload.friendshipId, club), state);
    default:
      return state;
  }
}

export function getClubs(clubList: [Club]) {
  return { type: 'GET_CLUBS', payload: clubList };
}

export function createClub(club: Club) {
  return { type: 'CREATE_CLUB', payload: club };
}

export function removeClub(clubId: number) {
  return { type: 'REMOVE_CLUB', payload: clubId };
}

export function updateClub(club: Club) {
  return { type: 'UPDATE_CLUB', payload: club };
}

export function addFriendship(friendship: number, clubId: number) {
  return { type: 'ADD_FRIENDSHIP', payload: { friendship, clubId } };
}

export function removeFriendship(friendshipId, clubId) {
  return { type: 'REMOVE_FRIENDSHIP', payload: { friendshipId, clubId } };
}

export function deleteFriendship(friendshipId) {
  return { type: 'DELETE_FRIENDSHIP', payload: { friendshipId } };
}

export function getGeneralClub() {
  return state => state.map(clubState => find(propEq('name', 'General'), values(clubState)));
}

