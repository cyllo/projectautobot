import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-heroes',
  templateUrl: 'heroes.component.html',
  styleUrls: ['heroes.component.scss']
})

export class HeroesComponent implements OnInit {

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

  selectedGameMode = 'quickPlay';
  gameModes = [
    {
      name: 'Quick Play',
      value: 'quickPlay'
    },
    {
      name: 'Competitive Play',
      value: 'competitivePlay'
    }
  ];

  constructor() {}

  ngOnInit() {}

  onScrollDown() {
    console.log('reached bottom of page so loading more data');
  }

}
