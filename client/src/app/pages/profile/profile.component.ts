import { Component, ChangeDetectorRef, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { AppState, Player } from '../../models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { SnapshotStats } from '../../models/player.model';

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

  lastSnapshot: SnapshotStats;
  secondToLastSnapshot: SnapshotStats;
  competitivePlay: SnapshotStats;
  quickPlay: SnapshotStats;
  snapshotStats: SnapshotStats = this.competitivePlay;
  isCompetitive = true;


  constructor(private store: Store<AppState>,
    private cd: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.playerData$ = this.store.select(players => players);
    this.playerData$.subscribe(p => {
      let tag = Object.keys(p.players);

      this.players = p.players;
      this.player = this.players[tag[0]];
      this.cd.markForCheck();
    });
    this.lastSnapshot = this.player.snapshotStatistics[this.player.snapshotStatistics.length - 1];
    this.secondToLastSnapshot = this.player.snapshotStatistics[this.player.snapshotStatistics.length - 2];
    this.sortSnapshotData(this.lastSnapshot);
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

  sortSnapshotData(data) {
    if (data.isCompetitive === true) {
      this.competitivePlay = data;
      this.quickPlay = this.secondToLastSnapshot;
    } else {
      this.quickPlay = data;
      this.competitivePlay = this.secondToLastSnapshot;
    }
  }

  toggleSnapshotStats() {
    this.isCompetitive ? this.snapshotStats = this.competitivePlay : this.snapshotStats = this.quickPlay;
    this.isCompetitive ? this.isCompetitive = false : this.isCompetitive = true;
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

}
