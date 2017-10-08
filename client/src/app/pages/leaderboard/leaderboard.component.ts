import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-leaderboard',
  templateUrl: 'leaderboard.component.html',
  styleUrls: ['leaderboard.component.scss']
})

export class LeaderboardComponent implements OnInit {
  selectedPlatform = 'pc';
  platforms = [
    {
      name: 'PC',
      value: 'pc'
    },
    {
      name: 'XBL',
      value: 'xbl'
    },
    {
      name: 'PSN',
      value: 'psn'
    }
  ];

  selectedRegion = 'us';
  regions = [
    {
      name: 'US',
      value: 'us'
    },
    {
      name: 'EU',
      value: 'eu'
    },
    {
      name: 'KR',
      value: 'kr'
    },
    {
      name: 'CH',
      value: 'ch'
    },
    {
      name: 'GBL',
      value: ''
    }
  ];

  selectedGameMode = 'quickplay';
  gameModes = [
    {
      name: 'Quick Play',
      value: 'quickplay'
    },
    {
      name: 'Competitive Play',
      value: 'competitive'
    }
  ];

  constructor() {}

  ngOnInit() {}

  onScrollDown() {
    console.log('reached bottom of page so loading more data');
  }

}
