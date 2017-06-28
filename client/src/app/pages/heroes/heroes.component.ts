import { Component, OnInit } from '@angular/core';
import { HeroStatistics } from '../../services';

@Component({
  selector: 'ow-heroes',
  templateUrl: 'heroes.component.html',
  styleUrls: [ 'heroes.component.scss' ],
  providers: [HeroStatistics]
})
export class HeroesComponent implements OnInit {
  heroes;

  constructor(private heroStatistics: HeroStatistics) {}

  ngOnInit() {
    this.loadHeroData();
  }

  loadHeroData() {
    return this.heroStatistics.getSnapshot()
    .subscribe(snapshotStats => this.heroes = snapshotStats);
  }
}
