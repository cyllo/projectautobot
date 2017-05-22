import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { isEmpty } from 'lodash';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { AppState, Player } from './models';
import { getPlayerData, searchGamerTag } from './reducers';

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
  $state: Observable<AppState>;
  searchResults = new Subject<Player[]>();
  isResultsOpen = false;


  constructor(private store: Store<AppState>, private apollo: Apollo) {
    this.$state = this.store.select(s => s);

    this.players = store.let(getPlayerData)
      .distinctUntilChanged()
      .filter(players => !isEmpty(players));

    this.sub = store.let(searchGamerTag)
      .filter(tag => Boolean(tag))
      .do(() => this.searchResults.next([]))
      .mergeMap((tag) => this.find(tag))
      .map(players => Object.values(players))
      .subscribe(this.searchResults);
  }

  onSearch(action) {
    console.log(action);
    this.isResultsOpen = !!action.payload;
    this.store.dispatch(action);
  }

  find(tag) {
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
                matchAwardsStatistic {
                  id
                  totalMedals
                  goldMedals
                  silverMedals
                  bronzeMedals
                  cards
                }
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
                  criticalHitsAccuracyPercentage
                  criticalHits
                }
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
                }
              }
              allHeroesSnapshotStatistic {
                matchAwardsStatistic {
                  id
                  totalMedals
                  goldMedals
                  silverMedals
                  bronzeMedals
                  cards
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
                  criticalHitsAccuracyPercentage
                  criticalHits
                }
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
        tag: tag
      }
    })
      .map(({data}) => data.searchGamerTag)
      .filter(data => data.length > 0)
      .map((playersData) => playersData.reduce((acc, player) => Object.assign(acc, {[player.tag]: player}), {}))
      .do((players) => this.store.dispatch({ type: 'ADD_PLAYER', payload: players }));
      // .do(playersData => this.store.dispatch({ type: 'GET_PLAYER_DATA', payload: playerData })) //not needed
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
