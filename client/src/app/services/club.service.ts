import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
    UpdateClub,
    RemoveFriendFromClub,
    AddFriend,
    DeleteClub,
    CreateClub,
} from './queries';
import { Store } from '@ngrx/store';
import { createClub, addFriendship, removeClub, updateClub, removeFriendship, ReducerStack } from '../reducers';
import { GraphqlResponse } from '../models';


@Injectable()
export class ClubService {
  constructor(private apollo: Apollo, private store: Store<ReducerStack>) {}

  update(id, name) {
    return this.apollo.mutate({
      mutation: UpdateClub,
      variables: { id, name }
    })
    .map(({ data: { updateFriendGroup: club } }: GraphqlResponse) => club)
    .subscribe(club => this.store.dispatch(updateClub(club)));
  }

  removeFriendship(friendshipId, clubId) {
    return this.apollo.mutate({
      mutation: RemoveFriendFromClub,
      variables: { friendshipId, clubId}
    })
    .subscribe(() => this.store.dispatch(removeFriendship(friendshipId, clubId)));
  }

  addFriendship(friendship, clubId) {
    return this.apollo.mutate({
      mutation: AddFriend,
      variables: { friendshipId: friendship.id, clubId }
    })
    .map(({ data: { addFriendGroupFriendship: { id } } }: GraphqlResponse) => id)
    .subscribe(id => this.store.dispatch(addFriendship(friendship, id)));
  }

  delete(id) {
    return this.apollo.mutate({
      mutation: DeleteClub,
      variables: { id }
    })
    .map(({data: {deleteFriendGroup: { deleted } } }: GraphqlResponse) => deleted)
    .subscribe(deleted => {
      if (deleted) {
        this.store.dispatch(removeClub(id));
      }
    });
  }

  create(name) {
    return this.apollo.mutate({
      mutation: CreateClub,
      variables: { name }
    })
    .map(({ data: { createFriendGroup: club } }: GraphqlResponse ) => club)
    .subscribe(club => this.store.dispatch(createClub(club)));
  }
}
