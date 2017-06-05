import { Observable } from 'rxjs/Observable';
import { SnapshotStats } from '../models';

export function snapshotData(state: SnapshotStats, { type, payload }: { type: string, payload?: any }) {
  switch (type) {
    case 'GET_SNAPSHOT_DATA':
      return payload;

    default:
      return state;
  }
}

export function getSnapshot(state$: Observable<SnapshotStats>) {
  return state$.select(players => players[0].snapshotStatistics);
}
