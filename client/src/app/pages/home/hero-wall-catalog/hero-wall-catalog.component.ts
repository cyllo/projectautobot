import { Component, OnInit, AfterContentInit } from '@angular/core';

import { OverwatchHeroDataService, OverwatchStaticData } from '../../../services';

@Component({
  selector: 'ow-hero-wall-catalog',
  templateUrl: 'hero-wall-catalog.component.html',
  styleUrls: ['hero-wall-catalog.component.scss']
})
export class HeroWallCatalogComponent implements OnInit, AfterContentInit {

  public heroData: OverwatchStaticData;

  constructor(private owHeroData: OverwatchHeroDataService) {}

  ngOnInit() {
    this.owHeroData.data$.subscribe(
      value => this.heroData = value,
      error => console.log(error)
    );
  }

  ngAfterContentInit() {
    // Called after ngOnInit when the component's or directive's content has been initialized.
    // Add 'implements AfterContentInit' to the class.
  }

  getHeroesOfRole(role: any) {
    return this.heroData['heroes'].filter(
      (hero) => { return hero.role === role; }
    );
  }

}
