import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'ow-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {

  player = {
    tag: 'Seagull-1894',
    platform: 'pc',
    region: 'us'
  };

  players = [
    {
      tag: 'Seagull-1894',
      platform: 'pc',
      region: 'us'
    }
  ];

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}

}
