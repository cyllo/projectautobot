import { GenericPayload } from '../models';
import { assoc, prop, not } from 'ramda';

interface WatcherState {
  isActive: boolean;
}

const initialState = {
  isActive: false
};



export function watchSnapshot(state: WatcherState = initialState, { type }: GenericPayload) {
  switch (type) {
    case 'TOGGLE_SNAPSHOT_WATCHER':
      return assoc('isActive', not(prop('isActive', state)), state);
    default:
      return state;
  }
}

export function toggleSnapshotWatcher() {
  return { type: 'TOGGLE_SNAPSHOT_WATCHER' };
}
