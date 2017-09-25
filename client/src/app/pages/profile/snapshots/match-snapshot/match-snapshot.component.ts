import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'ow-match-snapshot',
  templateUrl: 'match-snapshot.component.html',
  styleUrls: ['match-snapshot.component.scss']
})

export class MatchSnapshotComponent implements OnInit {
  @Input() snapshot;
  @Output() viewDetails = new EventEmitter<number>();
  viewSnapshot$ = new Subject<number>();

  heroesPlayed = [1, 2, 3];

  constructor() {}

  ngOnInit() {}

}
