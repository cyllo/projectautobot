import { Component, OnInit, ViewChild } from '@angular/core';
import { MdSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';

interface Hero {
  code: string;
  name: string;
  avatarUrl: string;
}

interface HeroPickRate {
  gamesPlayed: number;
  totalHeroesGamesPlayed: number;
}

interface HeroWinRate {
  gamesWon: number;
  gamesLost: number;
  gamesPlayed: number;
  totalHeroesGamesWon: number;
  totalHeroesGamesLost: number;
  totalHeroesGamesPlayed: number;
}

interface HeroTimeOnFire {
  timeOnFire: number;
  totalHeroesTimeOnFire: number;
}

interface HeroKDRatio {
  finalBlows: number;
  deaths: number;
  totalHeroesFinalBlows: number;
  totalHeroesDeaths: number;
}

interface HeroesLeaderboardDataEntry {
  position: number;
  hero: Hero;
  pickRate: HeroPickRate;
  winRate: HeroWinRate;
  timeOnFire: HeroTimeOnFire;
  kdRatio: HeroKDRatio;
}

@Component({
  selector: 'ow-heroes-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.scss']
})
export class HeroesTableComponent implements OnInit {

  @ViewChild(MdSort) sort: MdSort;
  dataSource: TableDataSource | null;

  displayedColumns = [
    'position',
    'hero',
    'pickRate',
    'winRate',
    'timeOnFire',
    'kdRatio'
  ];

  constructor() {}

  ngOnInit() {
    this.dataSource = new TableDataSource(this.sort);
  }

}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
class TableDataSource extends DataSource<any> {

  data: HeroesLeaderboardDataEntry[] = [];

  constructor(private _sort: MdSort) {
    super(); // must be called before accessing 'this'
    for (let i = 0; i < 40; ++i) {
      this.data.push(
        <HeroesLeaderboardDataEntry>{
          position: i + 1,
          hero: {
            code: '',
            name: 'Mercy',
            avatarUrl: 'https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000004.png'
          },
          pickRate: {
            gamesPlayed: 10,
            totalHeroesGamesPlayed: 20
          },
          winRate: {
            gamesWon: 20,
            gamesLost: 2,
            gamesPlayed: 10,
            totalHeroesGamesWon: 35,
            totalHeroesGamesLost: 6,
            totalHeroesGamesPlayed: 20
          },
          timeOnFire: {
            timeOnFire: 2500,
            totalHeroesTimeOnFire: 25000
          },
          kdRatio: {
            finalBlows: 25,
            deaths: 60,
            totalHeroesFinalBlows: 599,
            totalHeroesDeaths: 944
          }
        }
      );
    }
    console.log(this._sort);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return Observable.of(this.data);
  }

  disconnect() {}

}
