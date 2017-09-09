import { Component, Input } from '@angular/core';
import { Player } from '../../models';

@Component({
  selector: 'ow-profile-checkbox',
  templateUrl: 'profile-checkbox.component.html',
  styleUrls: ['profile-checkbox.component.scss']
})
export class ProfileCheckboxComponent {
  @Input() player: Player;

  players: object = {
    'cyllo-2112': {
      pc : {
        us : {}
      }
    }
  };

  constructor () {}
}
