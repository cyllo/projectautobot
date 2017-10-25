import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ApolloError } from 'apollo-client';
import { pathOr, split, trim, last, compose } from 'ramda';

const filterGraphqlMessage  = pathOr<string>('', ['graphQLErrors', 0, 'message']);
const cleanMessage = compose(trim, last, <any>split(':'), filterGraphqlMessage);

@Injectable()
export class ErrorHandlerService {

  constructor(private snackBar: MatSnackBar) {}

  show(error: string|ApolloError): void {
    const display = error instanceof Error
    ? cleanMessage(error)
    : error;

    this.snackBar.open(display, 'ok', {
      duration: 3500
    });
  }

  filterGraphqlMessage(error: ApolloError) {
    return new Error(cleanMessage(error));
  }
}
