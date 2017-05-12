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
  searchGamerTag: Player[];
  loading: boolean;
}

@Component({
  selector: 'ow-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  sub: Subscription;
  players: Observable<Player[]>;
  tag: String;

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
            updatedAt
            totalGamesWon
            tag
            snapshotStatistics {
              id
              isCompetitive
              gamerTagId
              heroSnapshotStatistics {
                id
                snapshotStatisticId
                matchAwardsStatisticId
                matchAwardsStatistic {
                  id
                  totalMedals
                  goldMedals
                  silverMedals
                  bronzeMedals
                  cards
                }
                heroSpecificStatisticId
                heroId
                hero {
                  id
                  code
                  name
                  insertedAt
                  updatedAt
                }
                gameHistoryStatisticId
                gameHistoryStatistic {
                  id
                  winPercentage
                  timeSpentOnFire
                  timePlayed
                  gamesWon
                  gamesPlayed
                  gamesLost
                }
                combatLifetimeStatisticId
                combatLifetimeStatistic {
                  id
                  weaponAccuracyPercentage
                  turretsDestroyed
                  timeSpentOnFire
                  teleporterPadsDestroyed
                  soloKills
                  shotsHit
                  shotsFired
                  reconAssists
                  offensiveAssists
                  objectiveTime
                  objectiveKills
                  multikills
                  multikillBest
                  meleeKills
                  meleeFinalBlows
                  healingDone
                  finalBlows
                  environmentalKills
                  environmentalDeaths
                  eliminationsPerLife
                  eliminations
                  defensiveAssists
                  deaths
                  damageDone
                  damageBlocked
                  criticalHitsPerMinute
                  criticalHitsAccuracyPercentage
                  criticalHits
                  criticalHitAccuracy
                }
                combatBestStatisticId
                combatBestStatistic {
                  id
                  weaponAccuracyBestInGamePercentage
                  timeSpentOnFireMostInGame
                  soloKillsMostInGame
                  selfHealingMostInGame
                  reconAssistsMostInGame
                  offensiveAssistsMostInGame
                  objectiveTimeMostInGame
                  objectiveKillsMostInGame
                  multikillBest
                  meleeKillsMostInGame
                  meleeFinalBlowsMostInLife
                  meleeFinalBlowsMostInGame
                  killStreakBest
                  healingDoneMostInLife
                  healingDoneMostInGame
                  finalBlowsMostInGame
                  eliminationsMostInLife
                  eliminationsMostInGame
                  defensiveAssistsMostInGame
                  damageDoneMostInLife
                  damageDoneMostInGame
                  damageBlockedMostInGame
                  criticalHitsMostInLife
                  criticalHitsMostInGame
                }
                combatAverageStatisticId
                combatAverageStatistic {
                  id
                  timeSpentOnFireAverage
                  soloKillsAverage
                  selfHealingAverage
                  offensiveAssistsAverage
                  objectiveTimeAverage
                  objectiveKillsAverage
                  meleeKillsAverage
                  meleeFinalBlowsAverage
                  healingDoneAverage
                  finalBlowsAverage
                  eliminationsAverage
                  defensiveAssistsAverage
                  deathsAverage
                  damageDoneAverage
                  damageBlockedAverage
                  criticalHitsAveragePercentage
                }
              }
            }
            region
            portraitUrl
            platform
            overwatchName
            levelUrl
            level
            insertedAt
            competitiveRankUrl
            competitiveLevel
          }
        }
      `,
      variables: {
        tag: this.tag || 'cyllo-2112'
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
