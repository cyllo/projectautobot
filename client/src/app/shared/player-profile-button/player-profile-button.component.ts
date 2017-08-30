import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { GamerTag, AppState } from '../../models';
import { Observable } from 'rxjs/Observable';
import { assoc, isNil } from 'ramda';
import { ProfileService } from '../../services';
import { resetTagSearch } from '../../reducers';

@Component({
  selector: 'ow-player-profile-button',
  templateUrl: 'player-profile-button.component.html',
  styleUrls: ['player-profile-button.component.scss'],
  providers: [ProfileService]
})
export class PlayerProfileButtonComponent implements OnInit {
  @Input('player') player: GamerTag;
  @Input('resultsMode') resultsMode: boolean;

  public async: any;

  playerData$: Observable<GamerTag>;

  constructor(private store: Store<AppState>, private profileService: ProfileService) {}

  ngOnInit() {
    this.playerData$ = Observable.of(this.player)
      .map(player => {
        return isNil(player.snapshotStatistics)
        ? assoc('snapshotStatistics', [], player)
        : player;
      });
  }

  navigateToProfile(player$: Observable<GamerTag>) {
    player$.take(1).subscribe(player => {
      this.store.dispatch(resetTagSearch());
      this.profileService.goto(player);
    });
  }
}
