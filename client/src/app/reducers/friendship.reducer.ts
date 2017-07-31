import { FriendShipState } from '../models';
import { dissoc, assoc } from 'ramda';

export function friendships(state: FriendShipState = {}, { type, payload }: {type: string, payload?: any|any[] }) {
    switch(type) {
        case 'GET_FRIEND_REQUESTS': //think about changing this to be more inclusive/all frienships
            return payload.reduce((acc, item) => Object.assign(acc, {[item.id]: item}), {});
        case 'REJECT_FRIEND_REQUEST':
            return dissoc(payload, state);
        case 'UPDATE_FRIEND_SHIP':
            console.log('in the reducers', payload)
            return assoc(payload.id, payload, state);
        default: 
            return state;
    }
}

export function getFriendRequests(requests) {
    return { type: 'GET_FRIEND_REQUESTS', payload: requests };
}

export function rejectFriendRequest(requestId) {
    return { type: 'REJECT_FRIEND_REQUEST', payload: requestId }
}

export function updateFriendship(friendship) {
    return { type: 'UPDATE_FRIEND_SHIP', payload: friendship};
}