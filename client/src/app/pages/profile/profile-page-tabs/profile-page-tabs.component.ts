import { Component, OnInit, Input } from '@angular/core';
import { SnapshotStats } from '../../../models';

@Component({
  selector: 'ow-profile-page-tabs',
  templateUrl: 'profile-page-tabs.component.html',
  styleUrls: ['profile-page-tabs.component.scss']
})

export class ProfilePageTabsComponent implements OnInit {
  @Input() snapshotStats: SnapshotStats;
  @Input() owHeroData: any;
  heroData: any;

  constructor() {}

  ngOnInit() {
    this.heroData = this.owHeroData;
  }

}
