import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SnapshotService } from '../../../services';
import { toggleSnapshotWatcher } from '../../../reducers';
import { Subject } from 'rxjs/Subject';
import { find, propEq, sort, prop, descend } from 'ramda';
import { Store } from '@ngrx/store';
import { AppState } from '../../../models';


@Component({
  selector: 'ow-snapshots-history',
  templateUrl: 'snapshots.component.html',
  styleUrls: ['snapshots.component.scss'],
  providers: [SnapshotService]
})
export class SnapshotsHistoryComponent implements OnInit, OnDestroy {
  @Input() modeIndicator: Observable<{ disabled: boolean, mode: string }>;
  selectedsnapshots: Observable<any>;
  viewDetails$ = new Subject<number>();
  destroyer$ = new Subject<void>();
  watchSnapshots$ = new Subject<boolean>();
  flushMatchDetails: Observable<null>;
  matchDetails: Observable<null>;
  view: Observable<any>;
  snapshotStore: any;
  watching: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private snapshotService: SnapshotService
  ) {}

  ngOnInit() {
    this.snapshotStore = this.store.select('snapshots');
    this.watching = this.store.select('watchSnapshot').pluck('isActive');

    this.selectedsnapshots = this.snapshotStore
    .pluck('snapshots')
    .combineLatest(this.modeIndicator, (snapshots, { mode }) => this.snapshotService.selectHeroesSnapshot(mode)(snapshots))
    .map(snapshots => sort(descend(prop('id')), snapshots))
    .takeUntil(this.destroyer$)
    .share();

    this.flushMatchDetails = this.modeIndicator.mapTo(null).takeUntil(this.destroyer$);

    this.view = this.viewDetails$.withLatestFrom(this.selectedsnapshots, (id, snapshots) => find(propEq('id', id), snapshots))
    .takeUntil(this.destroyer$);

    this.matchDetails = Observable.merge(this.view, this.flushMatchDetails);

    this.watchSnapshots$
    .takeUntil(this.destroyer$)
    .subscribe(() => this.store.dispatch(toggleSnapshotWatcher()));
  }

  ngOnDestroy() {
    this.destroyer$.next();
    this.destroyer$.complete();
  }
}
