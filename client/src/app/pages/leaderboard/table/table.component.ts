import { Component, OnInit, OnChanges, Input, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { LeaderboardService } from '../../../services';
import { PlayerLeaderboardDataEntry } from '../../../models';

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class LeaderboardTableDataSource extends DataSource<any> {

  data: PlayerLeaderboardDataEntry[] = [];

  constructor(private _data: Observable<PlayerLeaderboardDataEntry[]>, private _sort: MatSort) {
    super(); // must be called before accessing 'this'
    console.log(this._sort);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this._data;
  }

  disconnect() {}

}

@Component({
  selector: 'ow-leaderboard-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.scss'],
  providers: [LeaderboardService]
})
export class LeaderboardTableComponent implements OnInit, OnChanges {
  @Input() platform: string;
  @Input() region: string;
  @Input() gamemode: string;
  leaderboard: Observable<PlayerLeaderboardDataEntry[]>;

  @ViewChild(MatSort) sort: MatSort;
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

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit() {
    this.getLeaderboard();
  }

  ngOnChanges() {
    this.getLeaderboard();
  }

  getLeaderboard() {
    this.leaderboard = this.leaderboardService.getLeaderboard(this.platform, this.region, this.gamemode);
    this.dataSource = new LeaderboardTableDataSource(this.leaderboard, this.sort);
  }

}
