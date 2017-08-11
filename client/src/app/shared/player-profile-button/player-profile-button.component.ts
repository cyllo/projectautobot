import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '../../models';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ow-player-profile-button',
  templateUrl: 'player-profile-button.component.html',
  styleUrls: ['player-profile-button.component.scss']
})
export class PlayerProfileButtonComponent implements OnInit {
  @Input('player') player: Player;

  public async: any;

  playerData$: Observable<Player>;

  constructor (private router: Router) {}

  ngOnInit() {
    this.playerData$ = Observable.of(this.player);
  }

  navigateToProfile(player$: Observable<Player>) {
    player$.subscribe(player => {
      const {platform, region, tag} = player;
      this.router.navigate(['./profile', platform, region, tag]);
    });
  }

}
