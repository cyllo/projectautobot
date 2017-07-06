import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { AppState, Player } from '../../models';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SnapshotStats } from '../../models/player.model';
import { Observable } from 'rxjs/Observable';
import { ProfileService } from '../../services';

@Component({
  selector: 'ow-profile',
  templateUrl: 'profile.component.html',
  styleUrls: [ 'profile.component.scss' ],
  providers: [ProfileService]
})
export class ProfileComponent implements OnInit, OnDestroy, AfterContentInit {
  players: Observable<Object>;
  player;

  platform: string;
  region: string;
  tag: string;
  paramsSub;
  selectedSnapshot = new BehaviorSubject('competitive');
  selectedSnapshotData: Observable<SnapshotStats>;

  constructor(private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService
  ) {
    this.players = store.select('players');
    this.player = this.activatedRoute.params
    .flatMap(({tag, platform, region}) => {
      if (!region) {
        return this.players.pluck(tag, platform);
      }
      return this.players.pluck(tag, platform, region);
    })
    .filter(state => !!state)
    .map((player: Player) => Object.assign({}, player, {
      competitive: player.snapshotStatistics[player.snapshotStatistics.length - 1],
      quickPlay: player.snapshotStatistics[player.snapshotStatistics.length - 2]
    }));
    this.selectedSnapshotData = this.player.combineLatest(this.selectedSnapshot, (player, selectedSnapshot) => {
      return player[selectedSnapshot];
    });
  }

  ngOnInit() {
    this.paramsSub = this.activatedRoute.params.subscribe((params) => {
      this.platform = params['platform'];
      this.region = params['region'];
      this.tag = params['tag'];
    });
  }

  ngAfterContentInit() {
    if (this.tag) {
      this.store.dispatch({ type: 'GET_PLAYER_TAG', payload: { tag: this.tag, searching: false } });
    } else {
      this.router.navigate(['./']);
    }
  }

  toggleSnapshotStats(type: string) {
    this.selectedSnapshot.next(type);
  }

  changePlatformRegion(target: any) {
    let playerStream;
    if (target.region) {
      playerStream = this.players.pluck(target.platform, target.region);
    } else {
      playerStream = this.players.pluck(target.platform);
    }

    playerStream.subscribe((player: Player) => this.profileService.goto(player));
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}
