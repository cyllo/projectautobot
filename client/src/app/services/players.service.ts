import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { isEmpty } from 'lodash';
import { AppState, Player } from '../models';

@Injectable()
export class PlayersService {
  players: Observable<Player[]>;

  constructor(private store: Store<AppState>) {
    this.players = store.select(d => d.players)
      .filter(x => !isEmpty(x))
      .first();
  }

  loadData() {
    return this.players
      .do(() => this.store.dispatch({ type: 'LOAD' }));
  }

}
