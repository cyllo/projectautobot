import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { User } from '../models';
import { CreateUserMutation, ConnectUserToBattleNetMutation } from './queries';

interface UserParams extends User {
  clientAuthToken: string;
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

  connectToBattleNet(clientAuthToken) {
    return this.apollo.mutate({
      mutation: ConnectUserToBattleNetMutation,
      variables: { clientAuthToken }
    });
  }
}
