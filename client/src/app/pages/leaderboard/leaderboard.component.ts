import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-leaderboard',
  templateUrl: 'leaderboard.component.html',
  styleUrls: ['leaderboard.component.scss']
})

export class LeaderboardComponent implements OnInit {

  public columns;
  public rows;

  constructor() {
    // Do stuff
  }

  ngOnInit() {

    this.columns = [
      { prop : 'player' },
      { name : 'skillrating' }
    ];

    this.rows = [
      { player: 'Cyllo' , skillrating: '5000'}
    ];

  }

}
