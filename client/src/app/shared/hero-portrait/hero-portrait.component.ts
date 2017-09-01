import { Component, OnInit, Input } from '@angular/core';
import { OverwatchStaticData } from '../../models';
import { OverwatchHeroDataService } from '../../services';

@Component({
  selector: 'ow-hero-portrait',
  templateUrl: 'hero-portrait.component.html',
  styleUrls: ['hero-portrait.component.scss']
})
export class HeroPortraitComponent implements OnInit {
  @Input() owCode: string;
  @Input() class: string;

  hero: any;

  constructor(private owHeroData: OverwatchHeroDataService) {}

  public ngOnInit() {
    // if no code is passed exit func
    if (this.owCode == null) {
      this.hero = this.unknownHero();
      return;
    }
    let heroData: OverwatchStaticData;
    this.owHeroData.data$.subscribe(
      res => heroData = res,
      error => console.log(error),
      () => {
        const hero = heroData.heroes.find(({code}) => code === this.owCode);
        this.hero = hero ? hero : this.unknownHero();
      }
    );
  }

  unknownHero(): any {
    return {
      heroName: 'Unknown',
      portraitUrl: '/img/unknown_hero.jpg'
    };
  }

}
