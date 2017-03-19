import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-leaderboard',
  templateUrl: 'leaderboard.component.html',
  styleUrls: ['leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello leaderboard');
  }

}
