import { Component, ChangeDetectorRef, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { AppState, Player } from '../../models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { SnapshotStats } from '../../models/player.model';
import { Http } from '@angular/http';

@Component({
  selector: 'ow-profile',
  templateUrl: 'profile.component.html',
  styleUrls: [ 'profile.component.scss' ]
})

export class ProfileComponent implements OnInit, OnDestroy, AfterContentInit {
  playerData$: Observable<AppState>;
  players: Player[];
  player: Player;

  platform: string;
  region: string;
  tag: string;
  paramsSub;
  snapshotStats: SnapshotStats;

  heroData: JSON;

  constructor(private store: Store<AppState>,
    private cd: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: Http
  ) {
    this.playerData$ = this.store.select(state => state);
    this.playerData$.subscribe(s => {
      let tag = Object.keys(s.players);

      this.players = s.players;
      this.player = this.players[tag[0]];
      this.snapshotStats = s.snapshotStats;
      this.cd.markForCheck();
    });
  }

  ngOnInit() {
    this.getOverwatchHeroData().subscribe(
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

  toggleSnapshotStats(num: number) {
    this.store.dispatch({
      type: 'GET_SNAPSHOT_DATA',
      payload: this.player.snapshotStatistics[this.player.snapshotStatistics.length - num]
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

   getOverwatchHeroData() {
    return this.http.get('/lib/overwatch.json')
      .map(res => res.json());
  }

}
