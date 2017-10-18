import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SnapshotService, notNil } from '../../../../services';
import { prop, compose, path, merge, find, propEq, map, assoc } from 'ramda';
import { ReducerStack } from '../../../../reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'ow-match-details',
  templateUrl: 'match-details.component.html',
  styleUrls: ['match-details.component.scss']
})

export class MatchDetailsComponent implements OnInit {
  @Input() snapshot: any;
  heroes: Observable<any>;

  constructor(
    private snapshotService: SnapshotService,
    private store: Store<ReducerStack>
  ) {}

  ngOnInit() {

    this.heroes = Observable.of(this.snapshot)
    .filter(notNil)
    .map(profile => {
      const totalTimePlayed = path<number>([
        'heroesTotalSnapshotStatistic',
        'gameHistoryStatistic',
        'timePlayed'
      ], profile);

      return compose(
        this.snapshotService.percentagePlayed(totalTimePlayed),
        this.snapshotService.heroesByTimePlayed,
        prop('heroSnapshotStatistic')
      )(profile);
    })
    .withLatestFrom(this.store.select('heroes'), (heroes, heroesStore: any[]) => {
      const combineHeroData = hero => assoc('hero', merge(hero.hero, find(propEq('id', hero.heroId), heroesStore)), hero);
      return map(combineHeroData, heroes);
    })
    .do(val => console.log('working', val));
  }
}
