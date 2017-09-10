import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ow-recent-sessions',
  templateUrl: 'recent-sessions.component.html',
  styleUrls: [ 'recent-sessions.component.scss' ]
})

export class RecentSessionComponent implements OnInit {
  @Input() recentSnapshots: any[];
  constructor() {}

  ngOnInit() {}

}
