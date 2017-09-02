import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-compared-profiles',
  templateUrl: 'compared-profiles.component.html',
  styleUrls: ['compared-profiles.component.scss']
})
export class ComparedProfilesComponent implements OnInit {

  players = [];

  constructor() {}

  ngOnInit() {
    for (let i = 0; i < 20; ++i) {
      this.players.push(
        {
          tag: 'Seagull#1894',
          platform: 'pc',
          region: 'us'
        }
      );
    }
  }

}
