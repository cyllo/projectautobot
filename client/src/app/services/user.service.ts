import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { User } from '../models';
import { 
  CreateUserMutation,
  ConnectUserToBattleNetMutation,
  userSearchQuery } from './queries';

interface UserParams extends User {
  clientAuthToken: string;
}

interface searchResponse {
  data: any
}

@Injectable()
export class UserService {
  constructor(private apollo: Apollo) {}

  create({ password, email, displayName, clientAuthToken }: UserParams) {
    return this.apollo.mutate({
      mutation: CreateUserMutation,
      variables: { password, displayName, email, clientAuthToken }
    });
  }

  find(displayName) {
    return this.apollo.query({
      query: userSearchQuery,
      variables: { displayName }
    }).map(({ data: { users } }: searchResponse) => users);
  }

  connectToBattleNet(clientAuthToken) {
    return this.apollo.mutate({
      mutation: ConnectUserToBattleNetMutation,
      variables: { clientAuthToken }
    });
  }
}
