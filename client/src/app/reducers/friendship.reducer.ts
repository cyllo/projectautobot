import { FriendShipState } from '../models';

export function friendships(state: FriendShipState = {}, { type, payload }: {type: string, payload?: any|any[] }) {
    switch(type) {
        case 'GET_FRIEND_REQUESTS': 
            return payload.reduce((acc, item) => Object.assign(acc, {[item.id]: item}), {});
        default: 
            return state;
    }
}

export function getFriendRequests(requests) {
    return { type: 'GET_FRIEND_REQUESTS', payload: requests };
}