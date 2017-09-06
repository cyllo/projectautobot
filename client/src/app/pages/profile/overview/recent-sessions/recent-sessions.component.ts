import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-recent-sessions',
  templateUrl: 'recent-sessions.component.html',
  styleUrls: [ 'recent-sessions.component.scss' ]
})

export class RecentSessionComponent implements OnInit {

  sessions = [1, 2, 3];
  heroesPlayed = [1, 2, 3, 4, 5];

  constructor() {}

  ngOnInit() {}

}
