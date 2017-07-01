import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Credentials } from '../models';
import { LoginUserMutation } from './queries';

@Injectable()
export class AuthorizationService {
  constructor(private apollo: Apollo) {}

  login({ password, username: identifier }: Credentials ) {
    return this.apollo.mutate({
      mutation: LoginUserMutation,
      variables: { identifier, password }
    });
  }
}
