import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { SendFriendRequest } from './queries';
import { Store } from '@ngrx/store';
import { AppState } from '../models';

interface graphqlResponse {
  data: any
}

@Injectable()
export class FriendShipService {
    constructor(private apollo: Apollo, private store: Store<AppState>) {}


    request(id) {
        return this.apollo.mutate({
            mutation: SendFriendRequest,
            variables: { id }
        })
        .map(({ data: { sendFriendRequest: friendship } }: graphqlResponse) => friendship)
        .subscribe(friendship => this.store.dispatch({ type: 'ADD_FRIENDSHIP_REQUEST', payload: friendship}));
    }
}