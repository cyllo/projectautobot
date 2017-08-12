import { Component, Input, OnInit } from '@angular/core';
import {
  TransformedStats,
  HeroSnapshotStats,
  OverwatchStaticData,
  HeroStatBlock
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
  private _snapshotStats: TransformedStats;
  private heroData: OverwatchStaticData;
  statBlocks: HeroStatBlock[];

  constructor(private owHeroData: OverwatchHeroDataService) {
    this.owHeroData.data$.subscribe(
      res => this.heroData = res,
      error => console.log(error)
    );
  }

  ngOnInit() {}

  private reset() {
    this.statBlocks = [];
  }

  private load() {
    this.reset();
    this.statBlocks = this.statBlocks.concat(this.owHeroData.genericStatBlocksForHero(this._heroSnap,
      this._snapshotStats.heroesTotalSnapshotStatistic));
    this.statBlocks = this.statBlocks.concat(this.owHeroData.heroSpecificStatBlocksForHero(this._heroSnap,
      this._snapshotStats.heroesTotalSnapshotStatistic));
  }

}
