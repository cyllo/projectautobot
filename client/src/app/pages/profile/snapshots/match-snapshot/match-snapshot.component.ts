import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { SnapshotService } from '../../../../services';


@Component({
  selector: 'ow-match-snapshot',
  templateUrl: 'match-snapshot.component.html',
  styleUrls: ['match-snapshot.component.scss']
})

export class MatchSnapshotComponent implements OnInit {
  @Input() snapshot;
  @Output() viewDetails = new EventEmitter<number>();
  viewSnapshot$ = new Subject<number>();

  heroesPlayed: Observable<any>;

  constructor(private snapshotService: SnapshotService) {}

  ngOnInit() {
    this.heroesPlayed = Observable.of(this.snapshot)
    .pluck('heroSnapshotStatistic')
    .map(this.snapshotService.heroesByTimePlayed);
  }

}
