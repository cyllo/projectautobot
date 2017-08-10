import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ow-player-profile-button',
  templateUrl: 'player-profile-button.component.html',
  styleUrls: ['player-profile-button.component.scss']
})
export class PlayerProfileButtonComponent {
  @Input('player') player;

  constructor (private router: Router) {}

  navigateToProfile() {
    const player = this.player;
    this.router.navigate(['./profile', player.platform, player.region, player.tag]);
  }

}
