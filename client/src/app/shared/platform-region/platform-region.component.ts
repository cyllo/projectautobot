import { map, assoc, has, replace, prop, path, head, keys } from 'ramda';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { GamerTag } from '../../models';
import { Observable } from 'rxjs/Observable';
import { notNil } from '../../services';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'ow-platform-region',
  templateUrl: 'platform-region.component.html',
  styleUrls: ['platform-region.component.scss']
})
export class PlatformRegionComponent implements OnInit {
  @Input() currentProfile: GamerTag;
  @Input() players: Observable<GamerTag[]>;
  @Output() change = new EventEmitter<object>();
  activePlatforms: any;
  activeRegions: any;
  changePlatform$ = new Subject<string>();
  changeRegion$ = new Subject<string>();

  platforms: { name: string }[] = [{ name: 'pc'}, { name: 'xbl' }, { name: 'psn' }];

  regions: { name: string }[] = [{ name: 'us' }, { name: 'eu' }, { name: 'kr' }, { name: 'ch'}];

  constructor() { }

  ngOnInit() {

    this.activePlatforms = this.players
      .withLatestFrom(Observable.of(this.currentProfile), (players, targetProfile) => {
      const hasPlatform = platform => {
        return assoc('enabled', has(platform.name, prop(replace('#', '-', <string>prop('tag', targetProfile)), players)), platform);
      };
      return map(hasPlatform, this.platforms);
    });

    this.activeRegions = this.players
      .withLatestFrom(Observable.of(this.currentProfile), (players, targetProfile) => {
      const hasRegion = region => {
        return assoc(
          'enabled',
          notNil(path([targetProfile.platform, region.name], prop(replace('#', '-', <string>prop('tag', targetProfile)), players))),
          region
        );
      };
      return map(hasRegion, this.regions);
    });

    this.changePlatform$.withLatestFrom(this.players, (platform, players) => {
      const { platform: currentPlatform } = this.currentProfile;

      const getDefaultRegion = (currentGamertag, playerStore) => {
        const currentProfile = prop(replace('#', '-', <string>prop('tag', currentGamertag)), playerStore);

        return platform === 'pc' && currentPlatform !== 'pc'
          ? head(keys(prop(platform, currentProfile)))
          : currentGamertag.region;
      };

      return { platform, region: getDefaultRegion(this.currentProfile, players) };
    })
    .subscribe(targetGamerTag => this.change.emit(targetGamerTag));

    this.changeRegion$
    .map(region => {
      const { platform } = this.currentProfile;
      return { platform, region };
    })
    .subscribe(targetGamerTag => this.change.emit(targetGamerTag));
  }
}
