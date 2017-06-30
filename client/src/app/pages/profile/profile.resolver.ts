import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { Player } from '../../models';
import { AppState } from '../../models';
import { ProfileService } from '../../services/profile.service';

@Injectable()
export class ProfileResolver implements Resolve<Player> {
  constructor(private profileService: ProfileService, private store: Store<AppState>) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Player> {
    return this.profileService.findPlayer(route.params.tag, route.params.platform, route.params.region)
      .do((player) => this.store.dispatch({ type: 'NEW_PLAYER', payload: player }));
  }
}
