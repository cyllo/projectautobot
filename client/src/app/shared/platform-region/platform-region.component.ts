import { path } from 'ramda';

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from '../../models';

function pathExists(pathName: string[], item: any): boolean {
  return !!path(pathName, item);
}

@Component({
  selector: 'ow-platform-region',
  templateUrl: 'platform-region.component.html',
  styleUrls: ['platform-region.component.scss']
})
export class PlatformRegionComponent {
  @Input() player: Player;
  @Input() players: object;
  @Output() change = new EventEmitter<object>();

  constructor() { }

  platformAvailable(platform: string) {
    const tag = this.player.tag.replace('#', '-');

    return pathExists([tag, platform], this.players);
  }

  regionAvailable(region: string) {
    const tag = this.player.tag.replace('#', '-');

    return pathExists([tag, this.player.platform, region], this.players);
  }

  changePlatform(platform: string) {
    this.change.emit({
      platform,
      region: this.player.region
    });
  }

  changeRegion(region: string) {
    this.change.emit({
      platform: this.player.platform,
      region
    });
  }
}
