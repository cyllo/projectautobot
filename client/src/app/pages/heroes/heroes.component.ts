import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ow-heroes',
  templateUrl: 'heroes.component.html',
  styleUrls: ['heroes.component.scss']
})
export class HeroesComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('platform') platformInput;
  @ViewChild('region') regionInput;
  @ViewChild('mode') modeInput;
  @ViewChild('role') roleInput;
  @ViewChild('search') searchInput;
  @ViewChild('heroesTable') table: any;

  private platform;
  public platformName = 'platform';

  private region;
  public regionName = 'region';

  private mode;
  public modeName = 'mode';

  private role;
  public roleName = 'role';

  private search;
  public searchName = '';
  public searchControl = 'search';
  public searchPlaceholder = 'Search for a Hero';

  questionForm: FormGroup;
  subscriptions: Subscription[] = [];
  rows: any[] = [];

  columns = [
    { name: '', prop: 'id' },
    { name: 'Hero', prop: 'name' },
    { name: 'Pick Rate', prop: 'pickRate' },
    { name: 'Win Rate', prop: 'win' },
    { name: 'K/D Ratio', prop: 'kills / deaths' },
    { name: 'Medals/Game' }
    ];

  roles = ['OFFENSE', 'DEFENSE', 'TANK', 'SUPPORT'];
  platforms = ['PC', 'MAC', 'X-Box', 'PlayStation'];
  regions = ['US', 'Europe', 'Asia', 'South America', 'Africa', 'Australia'];
  modes = ['Escort', 'Assault', 'Hybrid', 'Control'];

  hero = {
    id: 1,
    name: 'MERCY',
    role: this.roles[Math.floor(Math.random() * this.roles.length)],
    image: 'https://pbs.twimg.com/media/CjzX5daVAAAzsIL.jpg',
    platform: this.platforms[Math.floor(Math.random() * this.platforms.length)],
    region: this.regions[Math.floor(Math.random() * this.regions.length)],
    mode: this.modes[Math.floor(Math.random() * this.modes.length)],
    pickRate: 64,
    win: 24,
    kills: 10,
    deaths: 5,
    medals: {
      gold: 1,
      silver: 2,
      bronze: 3
    }
  };

  heroes = Array(20).fill(this.hero);

  constructor() {
    this.fetch((data) => {
      this.rows = data;
    });
  }

  ngOnInit() {
    this.questionForm = new FormGroup({});
  }

  ngAfterContentInit() {
    this.platformInput.initControl(
      this.questionForm,
      this.platform,
      this.platformName,
      this.platformName,
      this.platforms
    );

    this.regionInput.initControl(
      this.questionForm,
      this.region,
      this.regionName,
      this.regionName,
      this.regions
    );

    this.modeInput.initControl(
      this.questionForm,
      this.mode,
      this.modeName,
      this.modeName,
      this.modes
    );

    this.roleInput.initControl(
      this.questionForm,
      this.role,
      this.roleName,
      this.roleName,
      this.roles
    );

    this.searchInput.initControl(
      this.questionForm,
      this.search,
      this.searchName,
      this.searchControl,
      this.searchPlaceholder,
      false
    );

    this.mapFormToModel();
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `/temp/heroesData.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  logit() {
    console.log(this.questionForm.getRawValue());
  }

  private mapFormToModel() {
    this.platformInput = this.questionForm.getRawValue();
    this.regionInput = this.questionForm.getRawValue();
    this.modeInput = this.questionForm.getRawValue();
    this.roleInput = this.questionForm.getRawValue();
    this.searchInput = this.questionForm.getRawValue();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
