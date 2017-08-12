import gql from 'graphql-tag';

export const gamerTagFetchQuery = gql`
  query FetchGamerTag($id: Int, $tag: String, $region: String, $platform: String, $snapshotLast: Int) {
    gamerTag(id: $id, tag: $tag, region: $region, platform: $platform) {
      id
      updatedAt
      tag
      region
      portraitUrl
      platform
      overwatchName
      insertedAt
      snapshotStatistics(last: $snapshotLast) {
        id
        gamerTagId
        profileSnapshotStatistic {
          profileStatistic {
            level
            levelUrl
            rankUrl
            competitiveLevel
            competitiveRankUrl
            totalGamesWon
          }
        }
        quickplayHeroSnapshotStatistics: heroSnapshotStatistics(type: QUICKPLAY) {
          ...heroStatFields
        }
        competitiveHeroSnapshotStatistics: heroSnapshotStatistics(type: COMPETITIVE) {
          ...heroStatFields
        }
        quickplayHeroesTotalSnapshotStatistic: heroesTotalSnapshotStatistic(type: QUICKPLAY) {
          ...totalStatFields
        }
        competitiveHeroesTotalSnapshotStatistic: heroesTotalSnapshotStatistic(type: COMPETITIVE) {
          ...totalStatFields
        }
      }
    }
  }

  fragment heroStatFields on HeroSnapshotStatistic {
    id
    statisticType
    heroSpecificStatistic {
      id
      stats
    }
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

  fragment totalStatFields on HeroesTotalSnapshotStatistic {
    statisticType
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
`;
