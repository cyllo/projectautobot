import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { isEmpty } from 'lodash';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { AppState, Player } from './models';
import { getPlayerData, getGamerTag } from './reducers';

import '../style/app.scss';

interface GamerTagSearchResponse {
  searchGamerTag: Player[]
  loading: boolean
}

@Component({
  selector: 'ow-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  sub: Subscription;
  players: Observable<Player[]>;

  constructor(private store: Store<AppState>, private apollo: Apollo) {
    this.players = store.let(getPlayerData)
      .distinctUntilChanged()
      .filter(players => !isEmpty(players));

    this.sub = store.let(getGamerTag)
      .distinctUntilChanged()
      .filter(tag => Boolean(tag))
      .subscribe(tag => console.log(tag));

    this.find()
      .subscribe(() => {});
  }

  find() {
    return this.apollo.query<GamerTagSearchResponse>({
      query: gql`
        query GamerTagSearch($tag: String!) {
          searchGamerTag(tag: $tag) {
            id
            tag
            overwatchName
            portraitUrl
            totalGamesWon
            competitiveLevel
            competitiveRankUrl
            region
            platform
            level
            levelUrl
            insertedAt
            updatedAt
          }
        }
      `,
      variables: {
        tag: 'cyllo-2112'
      }
    })
      .map(({data}) => data.searchGamerTag[0])
      .do(playerData => this.store.dispatch({ type: 'GET_PLAYER_DATA', payload: playerData }))
      .do(playerData => this.store.dispatch({ type: 'ADD_PLAYER', payload: { [playerData.tag]: playerData } }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
