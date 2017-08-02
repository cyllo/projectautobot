import { Component } from '@angular/core';

@Component({
  selector: 'ow-profile-list',
  templateUrl: 'profile-list.component.html',
  styleUrls: ['profile-list.component.scss']
})

export class ProfileListComponent {

  players = [
    {
      competitiveLevel: 2320,
      competitiveRankUrl: 'https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-3.png',
      id: 1,
      level: 70,
      levelUrl: 'https://blzgdapipro-a.akamaihd.net/game/playerlevelrewards/0x025000000000091E_Border.png',
      overwatchName: 'cyllo',
      platform: 'pc',
      portraitUrl: 'https://blzgdapipro-a.akamaihd.net/game/unlocks/0x02500000000010B9.png',
      region: 'us',
      tag: 'cyllo#2112'
    },
    {
      competitiveLevel: 2320,
      competitiveRankUrl: 'https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-3.png',
      id: 1,
      level: 70,
      levelUrl: 'https://blzgdapipro-a.akamaihd.net/game/playerlevelrewards/0x025000000000091E_Border.png',
      overwatchName: 'cyllo',
      platform: 'pc',
      portraitUrl: 'https://blzgdapipro-a.akamaihd.net/game/unlocks/0x02500000000010B9.png',
      region: 'us',
      tag: 'cyllo#2112'
    },
    {
      competitiveLevel: 2320,
      competitiveRankUrl: 'https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-3.png',
      id: 1,
      level: 70,
      levelUrl: 'https://blzgdapipro-a.akamaihd.net/game/playerlevelrewards/0x025000000000091E_Border.png',
      overwatchName: 'cyllo',
      platform: 'pc',
      portraitUrl: 'https://blzgdapipro-a.akamaihd.net/game/unlocks/0x02500000000010B9.png',
      region: 'us',
      tag: 'cyllo#2112'
    }
  ];

  constructor() {}

  onSelect(player) {
    console.log(player);
  }

}
