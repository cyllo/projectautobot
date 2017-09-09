import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, Player, Heroes, ChartData, ChartType } from '../../models';
import { CompareService, OverwatchHeroDataService } from '../../services';
import { addProfiles } from '../../reducers';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {
  assoc,
  chain,
  compose,
  concat,
  curry,
  filter,
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
  return `${date.getMonth()}-${date.getDate()}`;
};

interface GraphDataset {
  data: number[];
  label: string;
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
  datasets: Observable<GraphDataset[]>;
  selectedProfiles: Observable<Player[]>;
  selectedProfileKeys = new Subject<any[]>();
  selectedHeroes = new Subject<SelectedHeroes>();
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

    this.selectedProfiles = Observable.combineLatest([
      this.profiles,
      this.selectedProfileKeys
    ], (profiles, selectedProfileKeys) => {
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

    this.heroes.first().subscribe(heroes => {
      this.selectedHeroes.next(reduce((acc, hero) => {
        acc[hero.id] = true;
        return acc;
      }, {}, heroes));
    });

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
      return reduce((datasets, statCategory) => {
        return concat(chain((player: Player) => {
          const selectedHeroIds = map(key => parseInt(key, 10), keys(filter(identity, selectedHeroes)));
          return map(heroId => {
            const hero = find(({id}) => id === heroId, heroes);

            const snapshotsByDate = reduce((acc, snapshot) => {
              return assoc(dateToMMDD(new Date(snapshot.insertedAt)), snapshot, acc);
            }, {}, player.snapshotStatistics);

            const data = map(date => {
              const snapshot = snapshotsByDate[date];
              if (!snapshot) {
                return;
              }
              return stat(statCategory.value, heroId, snapshot);
            }, this.chartData.xAxisLabels);

            return {
              label: `${player.tag} - ${hero.name} - ${statCategory.name}`,
              data
            };
          }, selectedHeroIds);
        }, selectedProfiles), datasets);
      }, [], selectedStatCategories);
    });
  }
}
