import { Component, Input } from '@angular/core';
import { Player, SnapshotStats, HeroSnapshotStats, GameHistoryStats, MatchAwardsStats } from '../../../models';
import { FollowService } from '../follow.service';

@Component({
  selector: 'ow-profile-header',
  templateUrl: 'profile-header.component.html',
  styleUrls: ['profile-header.component.scss'],
  providers: [FollowService]
})

export class ProfileHeaderComponent {
  @Input() player: Player;

  snapshotStats: SnapshotStats;
  renewInProgress = false;

  constructor(private followService: FollowService) {}

  renew() {
    this.renewInProgress = !this.renewInProgress;
  }

  follow(player: Player) {
    this.followService.followGamerTag(player.id);
  }

  getStat(stat: string): number {
    if (!this.snapshotStats) {
      return 0;
    }

    let ahss: HeroSnapshotStats = this.snapshotStats.allHeroesSnapshotStatistic;
    let ghs: GameHistoryStats   = ahss.gameHistoryStatistic;
    let mas: MatchAwardsStats   = ahss.matchAwardsStatistic;

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
