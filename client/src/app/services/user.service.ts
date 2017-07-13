import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { User } from '../models';
import { CreateUserMutation, ConnectUserToBattleNetMutation } from './queries';

@Injectable()
export class UserService {
  constructor(private apollo: Apollo) {}

  create({ password, email, displayName }: User) {
    return this.apollo.mutate({
      mutation: CreateUserMutation,
      variables: { password, displayName, email }
    });
  }

  connectToBattleNet(clientAuthToken) {
    return this.apollo.mutate({
      mutation: ConnectUserToBattleNetMutation,
      variables: { clientAuthToken }
    });
  }
}
