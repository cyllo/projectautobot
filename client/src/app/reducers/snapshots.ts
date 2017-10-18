import { GenericPayload, SnapshotStats } from '../models';
import { assoc, prop, uniqBy } from 'ramda';

export const initialSnapShotState = {
  snapshots: [],
  watching: false,
};

export interface SnapshotState {
  watching: boolean;
  snapshots: SnapshotStats[];
}

const checkDupe = uniqBy(prop('id'));

export function snapshots(state: SnapshotState = initialSnapShotState, { type, payload }: GenericPayload) {
  switch (type) {
    case 'ADD_SNAPSHOT':
      return assoc('snapshots', checkDupe([payload, ...<SnapshotStats[]>prop('snapshots', state)]), state);
    case 'ADD_SNAPSHOTS':
      return assoc('snapshots', checkDupe([...payload, ...<SnapshotStats[]>prop('snapshots', state)]), state);
    case 'FLUSH_SNAPSHOTS':
      return assoc('snapshots', [], state);
    default:
      return state;
  }
}

export function addSnapshot(payload: SnapshotStats) {
  return { type: 'ADD_SNAPSHOT', payload };
}

export function addSnapshots(payload: SnapshotStats[]) {
  return { type: 'ADD_SNAPSHOTS', payload };
}

export function flushSnapshots() {
  return { type: 'FLUSH_SNAPSHOTS' };
}
