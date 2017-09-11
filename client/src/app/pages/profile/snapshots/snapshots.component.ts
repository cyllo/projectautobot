import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SnapshotService } from '../../../services';
import { Subject } from 'rxjs/Subject';
import { find, propEq } from 'ramda';

@Component({
  selector: 'ow-snapshots-history',
  templateUrl: 'snapshots.component.html',
  styleUrls: ['snapshots.component.scss'],
  providers: [SnapshotService]
})
export class SnapshotsHistoryComponent implements OnInit, OnDestroy {
  @Input() snapshots: Observable<any[]>;
  @Input() modeIndicator: Observable<{ disabled: boolean, mode: string }>;
  selectedsnapshots: Observable<any>;
  viewDetails$ = new Subject<number>();
  destroyer$ = new Subject<void>();
  view: Observable<any>;

  constructor(private snapshotService: SnapshotService) {}

  ngOnInit() {
    this.selectedsnapshots = this.snapshots
      .combineLatest(this.modeIndicator, (snapshots, { mode }) => this.snapshotService.selectHeroesSnapshot(mode)(snapshots))
      .takeUntil(this.destroyer$);

    this.view = this.viewDetails$.withLatestFrom(this.selectedsnapshots, (id, snapshots) => find(propEq('id', id), snapshots))
    .takeUntil(this.destroyer$).takeUntil(this.modeIndicator);
  }

  ngOnDestroy() {
    this.destroyer$.next();
    this.destroyer$.complete();
  }
}
