import { Component, Input } from '@angular/core';
import { Player } from '../../models';

@Component({
  selector: 'ow-profile-checkbox',
  templateUrl: 'profile-checkbox.component.html',
  styleUrls: ['profile-checkbox.component.scss']
})
export class ProfileCheckboxComponent {
  @Input() owTag: string;

  player: Player = <Player>{
    tag: 'cyllo#2112',
    platform: 'pc',
    region: 'us'
  };

  players: object = {
    'cyllo-2112': {
      pc : {
        us : {},
        eu : {},
        kr : {}
      }
    }
  };

  constructor () {}

}
