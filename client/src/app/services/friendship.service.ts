import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { SendFriendRequest, AcceptFriendRequest, RejectFriendRequest } from './queries';
import { GraphqlResponse } from '../models';


@Injectable()
export class FriendShipService {
    constructor(private apollo: Apollo) {}


    request(id) {
        return this.apollo.mutate({
            mutation: SendFriendRequest,
            variables: { id }
        })
        .map(({ data: { sendFriendRequest: friendship } }: GraphqlResponse) => friendship)
    }

    accept(friendUserId, friendshipId) {
        return this.apollo.mutate({
            mutation: AcceptFriendRequest,
            variables: { friendUserId, friendshipId }
        })
        .map(({ data: {acceptFriendRequest: { rejected }}}: GraphqlResponse) => rejected);;
    }

    reject(friendUserId, friendshipId) {
        return this.apollo.mutate({
            mutation: RejectFriendRequest,
            variables: { friendUserId, friendshipId }
        })
        .map(({ data: {rejectFriendRequest: { rejected }}}: GraphqlResponse) => rejected);
    }
}