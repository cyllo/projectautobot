import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { AppState, Player } from '../../models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ow-profile',
  templateUrl: 'profile.component.html',
  styleUrls: [ 'profile.component.scss' ]
})

export class ProfileComponent implements OnInit, OnDestroy {
  playerData$: Observable<AppState>;
  players: Player[];
  player: Player;

  region: string;
  platform: string;
  tag: string;
  paramsSub;

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef, private activatedRoute: ActivatedRoute) {
    this.playerData$ = this.store.select(players => players);
    this.playerData$.subscribe(p => {
      let tag = Object.keys(p.players);

      this.players = p.players;
      this.player = this.players[tag[0]];
      this.cd.markForCheck();
    });
  }

  ngOnInit() {
    this.paramsSub = this.activatedRoute.params.subscribe((params) => {
      this.region = params['region'];
      this.platform = params['platform'];
      this.tag = params['tag'];
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

}
