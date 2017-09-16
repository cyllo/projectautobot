import { Component, OnInit, OnChanges, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { GamerTagState, GamerTag } from '../../../models';
import {
  find,
  map,
  path,
  propEq,
  replace
} from 'ramda';

@Component({
  selector: 'ow-compared-profiles',
  templateUrl: 'compared-profiles.component.html',
  styleUrls: ['compared-profiles.component.scss']
})
export class ComparedProfilesComponent implements OnInit, OnChanges {
  @Input() profiles: GamerTagState;
  @Input() selectedKeys: GamerTag[];
  @Output() change = new EventEmitter<GamerTag[]>();
  players: GamerTag[];

  platforms: { name: string }[] = [{ name: 'pc'}, { name: 'xbl' }, { name: 'psn' }];
  regions: { name: string }[] = [{ name: 'us' }, { name: 'eu' }, { name: 'kr' }, { name: 'ch'}];

  constructor() {}

  ngOnInit() {
    this.collectPlayers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.profiles || changes.selectedKeys) {
      this.collectPlayers();
    }
  }

  collectPlayers() {
    if (!this.profiles || !this.selectedKeys) {
      return;
    }

    this.players = map(({tag, platform, region}) => {
      if (!region) {
        return path<GamerTag>([tag, platform], this.profiles);
      }
      return path<GamerTag>([tag, platform, region], this.profiles);
    }, this.selectedKeys);
  }

  hasPlatform(targetProfile, platform) {
    const tag = replace('#', '-', targetProfile.tag);
    return !path([tag, platform], this.profiles);
  }

  hasRegion(targetProfile, region) {
    const tag = replace('#', '-', targetProfile.tag);
    return !path([tag, targetProfile.platform, region], this.profiles);
  }

  changePlatform(targetProfile, event) {
    const tag = replace('#', '-', targetProfile.tag);
    const platform = event.value;
    const profileKey = find(propEq('tag', tag), this.selectedKeys);
    profileKey.platform = platform;
    this.change.emit(this.selectedKeys);
    this.collectPlayers();
  }

  changeRegion(targetProfile, event) {
    const tag = replace('#', '-', targetProfile.tag);
    const region = event.value;
    const profileKey = find(propEq('tag', tag), this.selectedKeys);
    profileKey.region = region;
    this.change.emit(this.selectedKeys);
    this.collectPlayers();
  }
}
