import { path } from 'ramda';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Player, PlatformRegion } from '../../models';

function pathExists(pathName: string[], item: any): boolean {
  return !!path(pathName, item);
}

@Component({
  selector: 'ow-platform-region',
  templateUrl: 'platform-region.component.html',
  styleUrls: ['platform-region.component.scss']
})
export class PlatformRegionComponent implements OnInit {
  @Input() player: Player;
  @Input() players: object;
  @Output() change = new EventEmitter<object>();

  platforms: PlatformRegion[] = [
    {
      name: 'PC',
      code: 'pc'
    },
    {
      name: 'XBL',
      code: 'xbl'
    },
    {
      name: 'PSN',
      code: 'psn'
    }
  ];

  regions: PlatformRegion[] = [
    {
      name: 'US',
      code: 'us'
    },
    {
      name: 'EU',
      code: 'eu'
    },
    {
      name: 'KR',
      code: 'kr'
    },
    {
      name: 'CH',
      code: 'ch'
    },
    {
      name: 'GBL',
      code: ''
    }
  ];

  constructor() { }

  ngOnInit() {
    console.log(this.player, this.players);
  }

  platformAvailable(platform: string) {
    const tag = this.player.tag.replace('#', '-');
    return pathExists([tag, platform], this.players);
  }

  regionAvailable(region: string) {
    const tag = this.player.tag.replace('#', '-');
    // console.log('dataset: ', tag, this.player.platform, region, this.players);
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
