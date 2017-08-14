import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-following',
  templateUrl: 'following.component.html',
  styleUrls: ['following.component.scss']
})
export class FollowingComponent implements OnInit {

  players: any[] = [];

  constructor() {
    for (let i = 0; i < 10; ++i) {
      this.players.push(
        {
          snapshotStatistics: {
            profileSnapshotStatistic: {
              profileStatistic: {
                competitiveLevel: 2320,
                competitiveRankUrl: 'https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-3.png',
              }
            }
          },
          id: 1,
          level: 70,
          levelUrl: 'https://blzgdapipro-a.akamaihd.net/game/playerlevelrewards/0x025000000000091E_Border.png',
          overwatchName: 'cyllo',
          platform: 'pc',
          portraitUrl: 'https://blzgdapipro-a.akamaihd.net/game/unlocks/0x02500000000008ED.png',
          region: 'us',
          tag: 'cyllo#2112'
        }
      );
    }
  }

  ngOnInit() {
    console.log('Hello following');
  }

}
