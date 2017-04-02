import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { isEmpty } from 'lodash';
import { AppState, PlayerData } from './models';
import { getPlayerData, getGamerTag } from './reducers';

import '../style/app.scss';

@Component({
  selector: 'ow-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  sub: Subscription;
  playerData: Observable<PlayerData>;

  constructor(private store: Store<AppState>, private http: Http) {
    this.playerData = store.let(getPlayerData)
      .distinctUntilChanged()
      .filter(playerData => !isEmpty(playerData));

    this.sub = store.let(getGamerTag)
      .distinctUntilChanged()
      .filter(gamerTag => Boolean(gamerTag))
      .subscribe(gamerTag => console.log(gamerTag));

    this.find().subscribe(() => {});
  }

  find() {
    return this.http.get(`/temp/kurtsStats.json`)
      .map(res => res.json())
      .do(playerData => this.store.dispatch({ type: 'GET_PLAYER_DATA', payload: playerData }));
  }
}
