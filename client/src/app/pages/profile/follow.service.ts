import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { FollowGamerTagMutation } from '../../queries';

@Injectable()
export class FollowService {
  constructor(private apollo: Apollo) {}

  followGamerTag(gamerTagId) {
    return this.apollo.mutate({
      mutation: FollowGamerTagMutation,
      variables: { gamerTagId }
    });
  }
}
