import { Component, OnInit, AfterContentInit, Input } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ow-hero-wall-catalog',
  templateUrl: 'hero-wall-catalog.component.html',
  styleUrls: ['hero-wall-catalog.component.scss']
})
export class HeroWallCatalogComponent implements OnInit, AfterContentInit {
@Input() owHeroData: any;

  public heroData: Observable<any>;

  constructor(private http: Http) {}

  ngOnInit() {
    this.getOverwatchHeroData().subscribe(
      value => this.heroData = value,
      error => console.log(error)
    );
  }

  ngAfterContentInit() {
    // Called after ngOnInit when the component's or directive's content has been initialized.
    // Add 'implements AfterContentInit' to the class.
  }

  getOverwatchHeroData(): Observable<any> {
    return this.http.get('/lib/overwatch.json')
      .map(res => res.json());
  }

  getHeroesOfRole(role: any) {
    return this.heroData['heroes'].filter(
      (hero) => { return hero.role === role; }
    );
  }

}
