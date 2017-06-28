import gql from 'graphql-tag';

export const HeroStatsAverageSearchQuery = gql`
  query HeroStatisticsAverageSearch($heroId: Int!) {
    heroStatisticsAverage(heroId: $heroId) {
      matchAwardsStatistic {
        totalMedals
        goldMedals
        silverMedals
        bronzeMedals
        cards
      }
      hero {
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
  }
`;
