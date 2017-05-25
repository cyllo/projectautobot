import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ow-hero-portrait',
  templateUrl: 'hero-portrait.component.html',
  styleUrls: ['hero-portrait.component.scss']
})
export class HeroPortraitComponent implements OnInit {
  @Input() owCode: String;

  private blizzard_image_cdn_url: String = "https://blzgdapipro-a.akamaihd.net/game/heroes/small/";

  public heroName: String;
  public heroRouteUrl: String;
  public heroThumbnailUrl: String;

  constructor() { }

  public ngOnInit() {

    if (this.owCode == null) {
      console.error("No code passed to hero portrait component");
      return this.failed();
    }

    this.heroName = "Not Implemented";
    this.heroThumbnailUrl = this.blizzard_image_cdn_url.toString() + this.owCode + ".png";
    this.heroRouteUrl = "./404";

  }

  private failed() {
    this.heroName = "Unknown";
    this.heroThumbnailUrl = "/img/unknown_hero.jpg";
    this.heroRouteUrl = "./404";
  }

}
