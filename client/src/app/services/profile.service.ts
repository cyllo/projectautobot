import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '../models';

@Injectable()
export class ProfileService {
  constructor(private router: Router) {}

  goto(player: Player) {
    const tag = player.tag.replace('#', '-');

    if (player.region) {
      this.router.navigate(['./profile', player.platform, player.region, tag]);
    } else {
      this.router.navigate(['./profile', player.platform, tag]);
    }
  }
}
