import { Component, Input } from '@angular/core';
import { Player } from '../../models';
@Component({
  selector: 'ow-platform-region',
  templateUrl: 'platform-region.component.html',
  styleUrls: ['platform-region.component.scss']
})
export class PlatformRegionComponent {
  @Input() player: Player;

  constructor() {}

}
