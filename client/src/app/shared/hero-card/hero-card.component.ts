import { Component, Input, OnInit } from '@angular/core';
// import { Store } from '@ngrx/store';
// import { AppState, HeroSnapshotStats } from '../../models';
// import { Observable } from 'rxjs/Observable';
import { HeroSnapshotStats } from '../../models';

@Component({
  selector: 'ow-hero-card',
  templateUrl: 'hero-card.component.html',
  styleUrls: [ 'hero-card.component.scss' ]
})

export class HeroCardComponent implements OnInit {
  @Input() heroSnap: HeroSnapshotStats;
  @Input() owHeroData: any;
  @Input() allHeroesSnap: HeroSnapshotStats;

  // state$: Observable<AppState>;

  heroData: any;

  private _allHeroSnaps;
  private _snapStats;

  constructor() { // private store: Store<AppState>
    /*
    this.state$ = this.store.select(state => state);
    this.state$.subscribe(s => {
      let tag = Object.keys(s.players);
      this._snapStats = s.players[tag[0]].snapshotStatistics[s.players[tag[0]].snapshotStatistics.length - 1];
    }); */
  }

  ngOnInit() {
    this.heroData = this.owHeroData;
    this._allHeroSnaps = this.allHeroesSnap;
    this._snapStats = this.heroSnap;
    console.log('all: ', this._allHeroSnaps, 'hero: ', this.heroSnap);
  }

  roleToString(id: number): String {
    return this.heroData.roles.find((x) => {
      return x.id === id;
    }).name;
  }

}
