import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map } from 'ramda';
@Component({
  selector: 'ow-platform-region-mode',
  templateUrl: 'platform-region-mode.html',
})
export class SelectorComponent implements OnInit {
  @Output() platform = new EventEmitter<string>();
  @Output() region = new EventEmitter<string>();
  @Output() mode = new EventEmitter<string>();
  changePlatform$ = new BehaviorSubject<string>('pc');
  changeRegion$ = new BehaviorSubject<string>('us');
  gameModeToggle$ = new BehaviorSubject<boolean>(true);

  platforms: { name: string; active: boolean }[] = [
    { name: 'pc', active: true },
    { name: 'xbl', active: false },
    { name: 'psn', active: false }
  ];

  regions: { name: string; active: boolean }[] = [
    { name: 'us', active: true },
    { name: 'eu', active: false },
    { name: 'kr', active: false },
    { name: 'ch', active: false }
  ];


  constructor() {}
  ngOnInit() {
    this.changePlatform$
    .do(platform => {
      this.platforms = map(({ name }) => name === platform ? { name, active: true } : { name, active: false }, this.platforms);
    })
    .subscribe(platform => this.platform.emit(platform));

    this.changeRegion$
    .do(region => this.regions = map(({ name }) => name === region ? { name, active: true } : { name, active: false }, this.regions))
    .subscribe(platform => this.region.emit(platform));

    this.gameModeToggle$
    .map(isCompetitive => isCompetitive ? 'Competitive' : 'Quickplay')
    .subscribe(gameMode => this.mode.emit(gameMode));
  }
}
