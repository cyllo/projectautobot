import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, Player, Heroes, ChartData, ChartType } from '../../models';
import { CompareService, OverwatchHeroDataService } from '../../services';
import { addProfiles } from '../../reducers';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {
  append,
  chain,
  compose,
  curry,
  not,
  reject,
  find,
  identity,
  isEmpty,
  keys,
  map,
  path,
  prop,
  propEq,
  reduce,
  replace,
  reverse,
  times,
  useWith
} from 'ramda';

const getHeroSnapshot = useWith(find, [propEq('heroId'), prop('heroSnapshotStatistics')]);
const stat = curry((key, heroId, player) => {
  return path(['combatLifetimeStatistic', key], getHeroSnapshot(heroId, player));
});

const daysAgo = n => {
  const now = new Date();
  now.setDate(now.getDate() - n);
  return now;
};

const dateToMMDD = date => {
  return `${date.getMonth() + 1}-${date.getDate()}`;
};

interface GraphDataRoot {
  name: string;
  series: GraphDatapoint[];
}

interface GraphDatapoint {
  name: string;
  value: number;
}

interface SelectedHeroes {
  [heroId: string]: boolean;
}

interface CustomHeroes extends Heroes {
  portraitUrl: string;
}

interface StatCategory {
  name: string;
  value: string;
  selected: boolean;
}

@Component({
  selector: 'ow-compare',
  templateUrl: 'compare.component.html',
  styleUrls: ['compare.component.scss'],
  providers: [CompareService]
})
export class CompareComponent implements OnInit {
  profiles: Observable<any>;
  heroes: Observable<CustomHeroes[]>;
  datasets: Observable<GraphDataRoot[]>;
  selectedProfiles: Observable<Player[]>;
  selectedProfileKeys = new Subject<any[]>();
  selectedHeroes: Observable<SelectedHeroes>;
  selectedHeroesInput = new Subject<SelectedHeroes>();
  selectedStatCategories = new Subject<string[]>();

  chartData: ChartData = {
      xAxisLabels: map(compose(dateToMMDD, daysAgo), reverse(times(identity, 7))),
      datasets: [],
      chartType: ChartType.bar,
      legend: false
  };

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private owHeroData: OverwatchHeroDataService,
    private compareService: CompareService
  ) {}

  ngOnInit() {
    this.route.queryParamMap.map(paramMap => paramMap.getAll('id'))
    .map(ids => map(id => parseInt(id, 10), ids))
    .mergeMap(ids => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      const endDate = new Date();
      return this.compareService.fetchStatistics({
        ids,
        type: 'COMPETITIVE',
        startDate,
        endDate
      });
    })
    .subscribe(profiles => {
      this.store.dispatch(addProfiles(profiles));
      const profileKeys = map(({ tag, platform, region }) => ({
        tag: replace('#', '-', tag),
        platform,
        region
      }), profiles);
      this.selectedProfileKeys.next(profileKeys);
    });

    this.profiles = this.store.select('profiles').skipWhile(isEmpty);

    this.selectedProfiles = Observable.combineLatest(
      [this.profiles, this.selectedProfileKeys], (profiles, selectedProfileKeys): Player[] => {
      return map(({tag, platform, region}) => {
        if (!region) {
          return path([tag, platform], profiles);
        }
        return path([tag, platform, region], profiles);
      }, selectedProfileKeys);
    });

    this.heroes = this.store.select<Heroes[]>('heroes')
      .skipWhile(isEmpty)
      .withLatestFrom(this.owHeroData.data$, (heroes, heroData) => {
        return map(hero => {
          const heroDataMatch = heroData.heroes.find(({code}) => code === hero.code);
          return Object.assign({}, hero, { portraitUrl: heroDataMatch.portraitUrl });
        }, heroes);
      });

    this.selectedHeroes = this.heroes.first()
      .map(heroes => reduce((acc, hero) => {
        acc[hero.id] = true;
        return acc;
      }, {}, heroes))
      .concat(this.selectedHeroesInput);

    this.datasets = Observable.combineLatest([
      this.selectedProfiles,
      this.heroes,
      this.selectedHeroes,
      this.selectedStatCategories
    ], (
      selectedProfiles: Player[],
      heroes: Heroes[],
      selectedHeroes: SelectedHeroes[],
      selectedStatCategories: StatCategory[]
    ) => {
      const isFalsy = not;
      const removeFalsy = reject(isFalsy);
      const removeFalsyKeys = compose(keys, removeFalsy);
      const selectedHeroIds = map(key => parseInt(key, 10), removeFalsyKeys(selectedHeroes));

      return map(date => {
        const series = chain(statCategory => {
          return chain((player: Player) => {
            return reduce((acc, heroId) => {
              const hero = find(({id}) => id === heroId, heroes);
              const snapshot = find(snapshotStatistic => {
                return date === dateToMMDD(new Date(snapshotStatistic.insertedAt));
              }, player.snapshotStatistics);

              if (!snapshot) {
                return acc;
              }

              const value = stat(statCategory.value, heroId, snapshot) || 0;

              return append({
                name: `${player.tag} - ${hero.name} - ${statCategory.name}`,
                value
              }, acc);
            }, [], selectedHeroIds);
          }, selectedProfiles);
        }, selectedStatCategories);
        return {
          name: date,
          series
        };
      }, this.chartData.xAxisLabels);
    });
  }
}
