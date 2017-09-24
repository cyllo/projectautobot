import { GenericPayload } from '../models';

interface TrendsState {
  competitiveHeroesTotalSnapshotStatistic: any;
  id: number;
  insertedAt: Date;
  profileSnapshotStatistic: any;
  quickplayHeroesTotalSnapshotStatistic: any;
}

export function statTrends(state: TrendsState[] = [], { type, payload }: GenericPayload) {
  switch (type) {
    case 'ADD_TREND':
      return [payload, ...state];
    case 'ADD_TRENDS':
      return [...payload, ...state];
    case 'FLUSH_TRENDS':
      return [];
    default:
      return state;
  }
}


export function addTrend(payload: TrendsState) {
  return { type: 'ADD_TREND', payload };
}

export function addTrends(payload: TrendsState[]) {
  return { type: 'ADD_TRENDS', payload };
}

export function flushTrends() {
  return { type: 'FLUSH_TRENDS' };
}
