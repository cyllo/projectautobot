import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { AppState, Player, OverwatchStaticData } from '../../models';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SnapshotStats } from '../../models/player.model';
import { Observable } from 'rxjs/Observable';

import { OverwatchHeroDataService } from '../../services';

@Component({
  selector: 'ow-profile',
  templateUrl: 'profile.component.html',
  styleUrls: [ 'profile.component.scss' ]
})

export class ProfileComponent implements OnInit, OnDestroy, AfterContentInit {
  players: Player[];
  player;

  platform: string;
  region: string;
  tag: string;
  paramsSub;
  selectedSnapshot = new BehaviorSubject('competitive');
  selectedSnapshotData: Observable<SnapshotStats>;
  heroData: OverwatchStaticData;

  constructor(private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private owHeroData: OverwatchHeroDataService
  ) {
    this.player = this.activatedRoute.params.flatMap((params) => {
      return store.select('players')
        .map(players => players[params.region + params.platform]);
    }).filter(state => !!state).map((player: Player) => {
      return Object.assign({}, player, {
        competitive: player.snapshotStatistics[player.snapshotStatistics.length - 1],
        quickPlay: player.snapshotStatistics[player.snapshotStatistics.length - 2]
      });
    });
    this.selectedSnapshotData = this.player.combineLatest(this.selectedSnapshot, (player, selectedSnapshot) => {
      return player[selectedSnapshot];
    });
  }

  ngOnInit() {
    this.owHeroData.data$.subscribe(
      res => this.heroData = res,
      error => console.log(error)
    );
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

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

}
