import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-leaderboard-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})
export class LeaderboardHeaderComponent implements OnInit {

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

  constructor() {}

  ngOnInit() {}

}
