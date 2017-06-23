import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from '../../models';

@Component({
  selector: 'ow-platform-region',
  templateUrl: 'platform-region.component.html',
  styleUrls: ['platform-region.component.scss']
})
export class PlatformRegionComponent {
  @Input() player: Player;
  @Input() players: Player[];
  @Output() change = new EventEmitter<string>();

  constructor() {}

  platformAvailable(platform: string) {
    const platformRegion = this.platformRegionString(this.player.region, platform);
    return Boolean(this.players[platformRegion]);
  }

  regionAvailable(region: string) {
    const platformRegion = this.platformRegionString(region, this.player.platform);
    return Boolean(this.players[platformRegion]);
  }

  changePlatform(platform: string) {
    const platformRegion = this.platformRegionString(this.player.region, platform);
    this.change.emit(platformRegion);
  }

  changeRegion(region: string) {
    const platformRegion = this.platformRegionString(region, this.player.platform);
    this.change.emit(platformRegion);
  }

  platformRegionString(region = '', platform: string) {
    return `${region}${platform}`;
  }
}
