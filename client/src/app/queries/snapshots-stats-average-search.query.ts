import gql from 'graphql-tag';

export const snapshotStatsAverageSearchQuery = gql`
  query SnapshotStatsAverageSearch($isCompetitive: Boolean!) {
    snapshotsStatisticsAverage(isCompetitive: $isCompetitive) {
      heroSnapshotStatistics {
        matchAwardsStatistic {
          totalMedals
          goldMedals
          silverMedals
          bronzeMedals
          cards
        }
        hero {
          id
          code
          name
          insertedAt
          updatedAt
        }
        gameHistoryStatistic {
          winPercentage
          timeSpentOnFire
          timePlayed
          gamesWon
          gamesPlayed
          gamesLost
        }
        combatLifetimeStatistic {
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
      allHeroesSnapshotStatistics {
        matchAwardsStatistic {
          totalMedals
          goldMedals
          silverMedals
          bronzeMedals
          cards
        }
        gameHistoryStatistic {
          winPercentage
          timeSpentOnFire
          timePlayed
          gamesWon
          gamesPlayed
          gamesLost
        }
        combatLifetimeStatistic {
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
  }
`;
