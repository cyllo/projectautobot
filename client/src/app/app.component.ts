import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { isEmpty } from 'ramda';

import { AppState, Player } from './models';
import { getPlayerData, searchGamerTag } from './reducers';
import {
  OverwatchHeroDataService,
  GamerTagService,
  HereosService,
  AuthorizationService } from './services';

import '../style/app.scss';

@Component({
  selector: 'ow-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [GamerTagService, HereosService, AuthorizationService]
})
export class AppComponent implements OnDestroy, OnInit {
  sub: Subscription;
  players: Observable<Player[]>;
  $state: Observable<AppState>;
  searchResults = new Subject<Player[]>();
  isResultsOpen = false;

  constructor(
    private store: Store<AppState>,
    private owHeroData: OverwatchHeroDataService,
    private gamerTagService: GamerTagService,
    private HereosService: HereosService,
    private authService: AuthorizationService) {

    this.$state = this.store.select(s => s);

    this.players = store.let(getPlayerData)
      .distinctUntilChanged()
      .filter(players => !isEmpty(players));

    this.sub = store.let(searchGamerTag)
      .do(() => this.searchResults.next([]))
      .mergeMap((search) => this.find(search))
      .subscribe(this.searchResults);

    this.getHeroes();

    this.owHeroData.load();
  }

  ngOnInit() {
    this.authService.setCurrentSession(JSON.parse(window.localStorage.getItem('session')));
  }

  onSearch(action) {
    this.isResultsOpen = !!action.payload;
    this.store.dispatch(action);
  }

  find(search) {
    return this.gamerTagService.find(search.tag)
      .switchMap((playerData) => Observable.forkJoin([Observable.of(playerData), this.owHeroData.data$ ]))
      .map(([_playerdata, owHeroData]) => {
        return _playerdata.map(player => Object.assign({}, player, {
          snapshotStatistics: player.snapshotStatistics
          .map(this.addHeroDataToSnapshot(owHeroData))
        }));
      })
      .do((players) => {
        if (!search.searching) {
          this.store.dispatch({ type: 'ADD_PLAYERS', payload: players });
        }
      });
  }

  getHeroes() {
    return this.HereosService.get()
    .subscribe(s => this.store.dispatch({ type: 'GET_HEROES_DATA', payload: s.data.heroes }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  addHeroesToHeroSnapshot(heroes) {
    return function(heroSnapshot) {
      return Object.assign({}, heroSnapshot, { hero: heroes.heroes.find( ({code}) => code === heroSnapshot.hero.code ) } );
    };
  }

  addHeroDataToSnapshot(heroes) {
    return (snapshot) => {
      return Object.assign({}, snapshot, {
        heroSnapshotStatistics: snapshot.heroSnapshotStatistics.map(this.addHeroesToHeroSnapshot(heroes))
      });
    };
  }

}
