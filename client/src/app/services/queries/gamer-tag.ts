import gql from 'graphql-tag';

const matchAwardsFragment = gql`
  fragment matchAwardsFields on MatchAwardsStatistic {
    id
    totalMedals
    goldMedals
    silverMedals
    bronzeMedals
    cards
  }
`;

const heroFragment = gql`
  fragment heroFields on Hero {
    id
    code
    name
    insertedAt
    updatedAt
  }
`;

const gameHistoryFragment = gql`
  fragment gameHistoryFields on GameHistoryStatistic {
    id
    winPercentage
    timeSpentOnFire
    timePlayed
    gamesWon
    gamesPlayed
    gamesLost
  }
`;

const combatLifeTimeFragment = gql`
  fragment combatLifetimeFields on CombatLifetimeStatistic {
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
`;

const combatBestFragment = gql`
  fragment combatBestFields on CombatBestStatistic {
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
`;

const combatAverageFragment = gql`
  fragment combatAverageFields on CombatAverageStatistic {
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
`;

const heroSnapShotStatisticFragment = gql`
  fragment heroStatFields on HeroSnapshotStatistic {
    id
    statisticType
    heroId
    gameHistoryStatisticId
    heroSpecificStatistic {
      id
      stats
    }
    matchAwardsStatistic {
      ...matchAwardsFields
    }
    hero {
      ...heroFields
    }
    gameHistoryStatistic {
      ...gameHistoryFields
    }
    combatLifetimeStatistic {
      ...combatLifetimeFields
    }
    combatBestStatistic {
      ...combatBestFields
    }
    combatAverageStatistic {
      ...combatAverageFields
    }
  }
  ${matchAwardsFragment}
  ${heroFragment}
  ${gameHistoryFragment}
  ${combatLifeTimeFragment}
  ${combatBestFragment}
  ${combatAverageFragment}
`;

const heroesTotalSnapShotStatisticFragment = gql`
  fragment totalStatFields on HeroesTotalSnapshotStatistic {
    statisticType
    matchAwardsStatistic {
      ...matchAwardsFields
    }
    gameHistoryStatisticId
    gameHistoryStatistic {
      ...gameHistoryFields
    }
    combatLifetimeStatistic {
      ...combatLifetimeFields
    }
    combatBestStatistic {
      ...combatBestFields
    }
    combatAverageStatistic {
      ...combatAverageFields
    }
  }
  ${matchAwardsFragment}
  ${gameHistoryFragment}
  ${combatLifeTimeFragment}
  ${combatBestFragment}
  ${combatAverageFragment}
`;

const snapshotFragment = gql`
  fragment snapshotStatistics on SnapshotStatistic {
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
  ${heroSnapShotStatisticFragment}
  ${heroesTotalSnapShotStatisticFragment}
`;

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
        ...snapshotStatistics
      }
      connectedGamerTags {
        id
        updatedAt
        tag
        region
        portraitUrl
        platform
        overwatchName
        insertedAt
        snapshotStatistics(last: $snapshotLast) {
          ...snapshotStatistics
        }
      }
    }
  }
  ${snapshotFragment}
`;

export const gamerTagScrapeMutation = gql`
  mutation GamerTagScrapeMutation($id: Int, $tag: String, $platform: String, $region: String, $snapshotLast: Int) {
    scrapeGamerTag(id: $id, tag: $tag, platform: $platform, region: $region) {
      id
      updatedAt
      tag
      region
      portraitUrl
      platform
      overwatchName
      insertedAt
      snapshotStatistics(last: $snapshotLast) {
        ...snapshotStatistics
      }
      connectedGamerTags {
        id
        updatedAt
        tag
        region
        portraitUrl
        platform
        overwatchName
        insertedAt
        snapshotStatistics(last: $snapshotLast) {
          ...snapshotStatistics
        }
      }
    }
  }
  ${snapshotFragment}
`;

export const gamerTagSearchMutation = gql`
  mutation GamerTagSearch($tag: String!) {
    searchGamerTag(tag: $tag) {
      id
      updatedAt
      tag
      region
      portraitUrl
      platform
      overwatchName
      insertedAt
      snapshotStatistics(last: 1) {
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
      }
    }
  }
`;
