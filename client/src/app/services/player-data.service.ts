import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, PlayerData } from '../models';

@Injectable()
export class PlayerDataService {
  playerData: Observable<PlayerData>;

  constructor(private store: Store<AppState>) {

  }

}
