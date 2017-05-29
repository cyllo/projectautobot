import { Component, OnInit, Input } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'ow-hero-portrait',
  templateUrl: 'hero-portrait.component.html',
  styleUrls: ['hero-portrait.component.scss']
})
export class HeroPortraitComponent implements OnInit {
  @Input() owCode: String;

  public heroName: String;
  public heroRouteUrl: String;
  public heroThumbnailUrl: String;

  constructor(private http: Http) { }

  public ngOnInit() {

    // if no code is passed exit func
    if (this.owCode == null) { return this.failed(); }
    let heroData: JSON;
    this.getOverwatchHeroData().subscribe(
      res => heroData = res,
      error => console.log(error),
      () => {
        let hero: any;
        hero = heroData['heroes'].find( ({code}) => code === this.owCode );
        this.heroName = hero.name;
        this.heroThumbnailUrl = hero.portraitUrl;
        this.heroRouteUrl = './hero/' + hero.name; 
      }
    );

  }

  private failed() {
    this.heroName = 'Unknown';
    this.heroThumbnailUrl = '/img/unknown_hero.jpg';
    this.heroRouteUrl = './404';
  }

  getOverwatchHeroData() {
    return this.http.get('/lib/overwatch.json')
      .map(res => res.json());
  }

}
