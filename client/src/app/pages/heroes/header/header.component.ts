import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-heroes-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})
export class HeroesHeaderComponent implements OnInit {

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

  selectedGameMode = 'comp';
  gameModes = [
    {
      name: 'Competitive',
      value: 'comp'
    },
    {
      name: 'Quick Play',
      value: 'quick'
    }
  ];

  constructor() {}

  ngOnInit() {}

}
