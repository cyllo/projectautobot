import { CurrentHero } from '../models';

const initialState: CurrentHero = {
  matchAwardsStatistic: null,
  hero: null,
  gameHistoryStatistic: null,
  combatLifetimeStatistic: null,
  combatBestStatistic: null,
  combatAverageStatistic: null
};

export function currentHeroData(state: CurrentHero = initialState, { type, payload }: { type:string, payload?: any }) {
  switch (type) {
    case 'GET_CURRENT_HERO_DATA':
      return payload;
    default:
      return state;
  }
}
