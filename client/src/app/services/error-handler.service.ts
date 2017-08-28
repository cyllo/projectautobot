import { Injectable } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { ApolloError } from 'apollo-client';
import { pathOr } from 'ramda';

@Injectable()
export class ErrorHandlerService {

  constructor(private snackBar: MdSnackBar) {}

  show(e: string): void {
    this.snackBar.open(e, 'ok', {
      duration: 3500
    });
  }

  filterGraphqlMessage(error: ApolloError) {
    return pathOr<string>('', ['graphQLErrors', 0, 'message'], error);
  }
}
