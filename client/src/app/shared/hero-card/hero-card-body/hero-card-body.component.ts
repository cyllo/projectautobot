import { Component, Input, OnInit } from '@angular/core';
import {
  SnapshotStats,
  HeroSnapshotStats,
  OverwatchStaticData
} from '../../../models';
import { OverwatchHeroDataService } from '../../../services';

@Component({
  selector: 'ow-hero-card-body',
  templateUrl: 'hero-card-body.component.html',
  styleUrls: [ 'hero-card-body.component.scss' ]
})

export class HeroCardBodyComponent implements OnInit {
  @Input()
  set snapshotStats(snapshotStats) {
    if (!snapshotStats) { return; }
    this._snapshotStats = snapshotStats;
  }
  get snapshotStats() {
    return this._snapshotStats;
  }

  @Input()
  set heroSnap(heroSnap) {
    if (!heroSnap) { return; }
    this._heroSnap = heroSnap;
    this.load();
  }
  get heroSnap() {
    return this._heroSnap;
  }

  private _heroSnap: HeroSnapshotStats;
  private _snapshotStats: SnapshotStats;
  private heroData: OverwatchStaticData;
  warehouse: Array<any>;

  constructor(private owHeroData: OverwatchHeroDataService) {
    this.owHeroData.data$.subscribe(
      res => this.heroData = res,
      error => console.log(error)
    );
  }

  ngOnInit() {}

  private reset() {
    this.warehouse = [];
  }

  private load() {
    this.reset();
    let ohd = this.owHeroData;
    let ss  = this._snapshotStats;
    let hs  = this._heroSnap;
    this.warehouse = this.warehouse.concat(ohd.genericStats(ss, hs));
    this.warehouse = this.warehouse.concat(ohd.heroSpecificStats(ss, hs));
  }

}