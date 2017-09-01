import { Component, OnInit, ViewChild } from '@angular/core';
import { MdSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';

interface Hero {
  code: string;
  name: string;
  avatarUrl: string;
}

interface CompetitiveSkillRating {
  rankUrl: string;
  rank: number;
}

interface Player {
  tag: string;
  avatarUrl: string;
}

interface PlayerLeaderboardDataEntry {
  position: number;
  platform: string;
  region: string;
  player: Player;
  level: number;
  competitiveRating: CompetitiveSkillRating;
  timeOnFire: number;
  kdRatio: number;
  wins: number;
  lost: number;
  winRate: number;
  timePlayed: number;
  mostPlayedHeroes: Hero[];
}

@Component({
  selector: 'ow-leaderboard-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.scss']
})
export class LeaderboardTableComponent implements OnInit {

  @ViewChild(MdSort) sort: MdSort;
  dataSource: LeaderboardTableDataSource | null;

  displayedColumns = [
    'position',
    'platform',
    'region',
    'player',
    'level',
    'competitiveRating',
    'timeOnFire',
    'kdRatio',
    'wins',
    'lost',
    'winRate',
    'timePlayed',
    'mostPlayedHeroes'
  ];

  constructor() {}

  ngOnInit() {
    this.dataSource = new LeaderboardTableDataSource(this.sort);
  }

}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class LeaderboardTableDataSource extends DataSource<any> {

  data: PlayerLeaderboardDataEntry[] = [];

  constructor(private _sort: MdSort) {
    super(); // must be called before accessing 'this'
    for (let i = 0; i < 40; ++i) {
      this.data.push(
        <PlayerLeaderboardDataEntry>{
          position: i + 1,
          platform: 'pc',
          region: 'us',
          player: {
            avatarUrl: 'https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/0x0250000000000304.png',
            tag: 'Seagull#1894'
          },
          level: 351,
          competitiveRating: {
            rankUrl: 'https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-7.png',
            rank: 2350
          },
          timeOnFire: 25000,
          kdRatio: 1.98,
          wins: 250,
          lost: 100,
          winRate: 75,
          timePlayed: 123456789,
          mostPlayedHeroes: [
            {
              code: '',
              name: 'Soldier-76',
              avatarUrl: 'https://blzgdapipro-a.akamaihd.net/hero/soldier-76/hero-select-portrait.png'
            },
            {
              code: '',
              name: 'Soldier-76',
              avatarUrl: 'https://blzgdapipro-a.akamaihd.net/hero/soldier-76/hero-select-portrait.png'
            },
            {
              code: '',
              name: 'Soldier-76',
              avatarUrl: 'https://blzgdapipro-a.akamaihd.net/hero/soldier-76/hero-select-portrait.png'
            }
          ]
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
