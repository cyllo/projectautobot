import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { AppState, Player } from '../../models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ow-profile',
  templateUrl: 'profile.component.html',
  styleUrls: [ 'profile.component.scss' ]
})

export class ProfileComponent implements OnInit, OnDestroy {
  playerData$: Observable<AppState>;
  players: Player[];
  player: Player;

  platform: string;
  region: string;
  tag: string;
  paramsSub;

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
      this.store.dispatch({ type: 'GET_PLAYER_TAG', payload: { tag: this.tag, searching: true } });
    } else {
      this.router.navigate(['./']);
    }
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

}
