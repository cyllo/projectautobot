import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { isEmpty } from 'lodash';
import { AppState, PlayerData } from '../models';

@Injectable()
export class PlayerDataService {
  playerData: Observable<PlayerData>;

  constructor(private store: Store<AppState>) {
    this.playerData = store.select(d => d.playerData)
      .filter(x => !isEmpty(x))
      .first();
  }

  loadData() {
    return this.playerData
      .do(() => this.store.dispatch({ type: 'LOAD' }))
  }

}
