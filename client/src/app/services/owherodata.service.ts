import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Http } from '@angular/http';
import { OverwatchStaticData, HeroData } from '../models';

@Injectable()
export class OverwatchHeroDataService {
  private _data$ = new ReplaySubject<OverwatchStaticData> ();
  data$ = this._data$.asObservable();

  constructor(private http: Http) {}

  load() {
    this.http.get('/lib/overwatch.json')
      .map(res => res.json())
      .subscribe(this._data$);
  }

  // Returns an array of heroes that belong to the specified role.
  getHeroesOfRole(data: OverwatchStaticData, role: number): Array<HeroData> {
      return data.heroes.filter((hero) => {
          return +hero.role === role;
        }
      );
  }

}
