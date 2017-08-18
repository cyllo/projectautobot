import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { Player } from '../../models';
import { AppState } from '../../models';
import { ProfileService } from '../../services/profile.service';
import { prop, omit } from 'ramda';


@Injectable()
export class ProfileResolver implements Resolve<Player> {
  constructor(private profileService: ProfileService, private store: Store<AppState>, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Player> {
    return this.profileService.findOrScrapeGamerTag(route.params.tag, route.params.platform, route.params.region)
    .map((gamerTag: any) => {
      const connectedTags: any = prop('connectedGamerTags', gamerTag);
      return [...connectedTags, omit('connectedGamerTags', gamerTag)];
    })
    .do((player) => this.store.dispatch({ type: 'ADD_PLAYERS', payload: player }))
    .catch(() => this.redirectOnError());
  }

  redirectOnError() {
    this.router.navigate(['']);
    return Observable.of({});
  }
}
