import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { pathOr, test } from 'ramda';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ApolloError } from 'apollo-client';

import { Player } from '../../models';
import { AppState } from '../../models';
import { ProfileService } from '../../services/profile.service';

const graphqlError = pathOr<string>('', ['graphQLErrors', 0, 'message']);
const testNotFound = test(/not found/i);

@Injectable()
export class ProfileResolver implements Resolve<Player> {
  constructor(private profileService: ProfileService, private store: Store<AppState>, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Player> {
    return this.profileService.findPlayer(route.params.tag, route.params.platform, route.params.region)
      .catch((error) => this.catchFindError(route, error))
      .do((player) => this.store.dispatch({ type: 'NEW_PLAYER', payload: player }))
      .catch((error) => Observable.of(error));
  }

  catchFindError(route: ActivatedRouteSnapshot, apolloError: ApolloError) {
    if (testNotFound(graphqlError(apolloError))) {
      return this.profileService.scrapeGamerTag(route.params.tag, route.params.platform, route.params.region)
        .catch((error) => this.catchScrapeError(error));
    } else {
      return Observable.throw(apolloError);
    }
  }

  catchScrapeError(apolloError: ApolloError) {
    if (testNotFound(graphqlError(apolloError))) {
      this.router.navigate(['']);
    }

    return Observable.throw(apolloError);
  }
}
