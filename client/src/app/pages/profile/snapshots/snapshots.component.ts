import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-snapshots-history',
  templateUrl: 'snapshots.component.html',
  styleUrls: ['snapshots.component.scss'],
})
export class SnapshotsHistoryComponent implements OnInit {

  matchesPlayed = [];

  constructor() {}

  ngOnInit() {
    for (let i = 0; i < 20; ++i) { this.matchesPlayed.push(i); }
  }

}
