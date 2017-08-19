import { Component, Input, OnInit } from '@angular/core';
import { Player, TransformedStats, HeroSnapshotStats, GameHistoryStats, MatchAwardsStats } from '../../../models';
import { ProfileService, FollowService } from '../../../services';

@Component({
  selector: 'ow-profile-overview',
  templateUrl: 'overview.component.html',
  styleUrls: ['overview.component.scss'],
  providers: [ProfileService, FollowService]
})

export class ProfileOverviewComponent implements OnInit {
  @Input('player')
  get player(): Player {
    return this._player;
  }
  set player(player: Player) {
    this._player = player;
    this.load();
  }

  private _player: Player;

  snapshotStats: TransformedStats;
  renewInProgress = false;
  statChanges = {
    winPercentage: 0
  };

  constructor(private profileService: ProfileService, private followService: FollowService) {}

  load() {

  }

  ngOnInit() {
    this.profileService.getOverviewStatChanges(this.player)
      .subscribe(results => {
        this.statChanges = results;
      });
  }

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

    let htss: HeroSnapshotStats = this.snapshotStats.heroesTotalSnapshotStatistic;
    let ghs: GameHistoryStats   = htss.gameHistoryStatistic;
    let mas: MatchAwardsStats   = htss.matchAwardsStatistic;

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
