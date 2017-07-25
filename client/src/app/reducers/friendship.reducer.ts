import { assoc, dissoc } from 'ramda';

export function friendships(state: any = {}, { type, payload }: {type: string, payload?: any }) {
    switch(type) {
        case 'ADD_FRIENDSHIP_REQUEST': 
            return  assoc(payload.id, payload, state);
        case 'REJECT_FRIENDSHIP':
            return dissoc(payload.id, state);
        case 'APPROVE_FRIENDSHIP':
            return assoc(payload.id, payload, state);
        default: 
            return state;
    }
}