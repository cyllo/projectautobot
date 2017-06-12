import { Component, OnInit, AfterContentInit } from '@angular/core';

import { OverwatchStaticData, HeroData } from '../../../models';
import { OverwatchHeroDataService } from '../../../services';

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

  getHeroesOfRole(role: number): Array<HeroData> {
    return this.owHeroData.getHeroesOfRole(this.heroData, role);
  }

}
