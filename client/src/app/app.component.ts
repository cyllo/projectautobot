import { Component, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { isEmpty } from 'lodash';
import { AppState, Player } from './models';
import { getPlayerData, getGamerTag } from './reducers';

import '../style/app.scss';

@Component({
  selector: 'ow-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  sub: Subscription;
  players: Observable<Player[]>;

  constructor(private store: Store<AppState>, private http: Http) {
    this.players = store.let(getPlayerData)
      .distinctUntilChanged()
      .filter(players => !isEmpty(players));

    this.sub = store.let(getGamerTag)
      .distinctUntilChanged()
      .filter(tag => Boolean(tag))
      .subscribe(tag => console.log(tag));

    this.find().subscribe(() => {});
  }

  find() {
    return this.http.get(`/temp/playerData.json`)
      .map(res => res.json())
      .do(playerData => this.store.dispatch({ type: 'GET_PLAYER_DATA', payload: playerData }))
      .do(playerData => this.store.dispatch({ type: 'ADD_PLAYER', payload: { [playerData.tag]: playerData } }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
