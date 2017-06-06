import { Observable } from 'rxjs/Observable';
import { AppState, SnapshotStats } from '../models';

export function snapshotData(state: SnapshotStats, { type, payload }: { type: string, payload?: any }) {
  switch (type) {
    case 'GET_SNAPSHOT_DATA':
      return payload;

    default:
      return state;
  }
}

export function getSnapshot(state$: Observable<AppState>) {
  return state$.select(state => state.players[0].snapshotStatistics);
}
