import { AfterContentInit, Component, Input } from '@angular/core';
import { Player, SnapshotStats } from '../../../models';

@Component({
  selector: 'ow-profile-header',
  templateUrl: 'profile-header.component.html',
  styleUrls: ['profile-header.component.scss']
})

export class ProfileHeaderComponent implements AfterContentInit {
  @Input() player: Player;
  snapshotStats: SnapshotStats;

  constructor() {}

  ngAfterContentInit() {
    this.snapshotStats = this.player.snapshotStatistics[this.player.snapshotStatistics.length - 1];
  }

  getStat(stat: string): number {

    let ahss = this.snapshotStats.allHeroesSnapshotStatistic;
    let ghs = ahss.gameHistoryStatistic;
    let mas = ahss.matchAwardsStatistic;

    switch (stat) {

      case 'winrate' :

        let winrate = (ghs.gamesWon / ghs.gamesPlayed) * 100;
        return winrate;

      case 'wins' :

        let wins = ghs.gamesWon;
        return wins;

      case 'loss' :

        let loss = ghs.gamesLost;
        return loss;

      case 'gamesplayed' :

        let gamesplayed = ghs.gamesPlayed;
        return gamesplayed;

      case 'medals-gold' :

        let gold = mas.goldMedals;
        return gold;

      case 'medals-silver' :

        let silver = mas.silverMedals;
        return silver;

      case 'medals-bronze' :

        let bronze = mas.bronzeMedals;
        return bronze;

      case 'leaderboardrating' :

        return 0;

      default:

        return -1;

    }

  }

}
