import { Component, ChangeDetectorRef } from '@angular/core';
import { AppState, Player } from '../../models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ow-profile',
  templateUrl: 'profile.component.html',
  styleUrls: [ 'profile.component.scss' ]
})

export class ProfileComponent {
  playerData$: Observable<AppState>;
  players: Player[];
  player: Player;

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef) {
    this.playerData$ = this.store.select(players => players);
    this.playerData$.subscribe(p => {
      let tag = Object.keys(p.players);

      this.players = p.players;
      this.player = this.players[tag[0]];
      this.cd.markForCheck();
    });
  }

}
