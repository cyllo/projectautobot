import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ow-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('search') search;
  questionForm: FormGroup;
  subscriptions: Subscription[] = [];

  private player;
  public fieldName = 'HEROES';
  private controlName = 'search';
  private searchPlaceholder = 'Search for a specific hero';

  videoUrl = 'http://img.youtube.com/vi/DWqhXWRaMmU/mqdefault.jpg';
  heroes = [
    {
      playerImage: this.videoUrl,
      playerName: 'TEST-FIRST',
      points: 26,
      viewers: '89,836',
    }, {
      playerImage: this.videoUrl,
      playerName: 'TEST-SECOND',
      points: 5000,
      viewers: '500,836',
    }, {
      playerImage: this.videoUrl,
      playerName: 'TEST-THIRD',
      points: 156,
      viewers: '890,836',
    }, {
      playerImage: this.videoUrl,
      playerName: 'TEST-FOURTH',
      points: 11567,
      viewers: '349,836',
    }, {
      playerImage: this.videoUrl,
      playerName: 'TEST-FIFTH',
      points: 11567,
      viewers: '349,836',
    }, {
      playerImage: this.videoUrl,
      playerName: 'TEST-SIXTH',
      points: 11567,
      viewers: '349,836',
    }
  ];

  roleData = [
    {
      role: 'OFFENSE',
      icon: '/img/OffenseIcon.svg',
      plays: '43,125,675',
      percentage: 25
    }, {
      role: 'DEFENSE',
      icon: '/img/DefenseIcon.svg',
      plays: '43,125,675',
      percentage: 25
    }, {
      role: 'TANK',
      icon: '/img/TankIcon.svg',
      plays: '43,125,675',
      percentage: 25
    }, {
      role: 'SUPPORT',
      icon: '/img/SupportIcon.svg',
      plays: '43,125,675',
      percentage: 25
    }
  ];

  newsData = [
    {
      newsImage: 'http://placehold.it/350x150',
      newsTitle: 'META SNAPSHOT #39',
      newsSubTitle: 'META SNAPSHOT #39',
      newsContent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
      newsImage: 'http://placehold.it/350x150',
      newsTitle: 'META SNAPSHOT #39',
      newsSubTitle: 'META SNAPSHOT #39',
      newsContent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
  ];

  constructor() {

  }

  ngOnInit() {
    this.questionForm = new FormGroup({});
  }

  ngAfterContentInit() {
    this.search.initControl(
      this.questionForm,
      this.player,
      this.fieldName,
      this.controlName,
      this.searchPlaceholder,
      false
    );
    this.mapFormToModel();
  }

  private mapFormToModel() {
    this.search = this.questionForm.getRawValue();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
