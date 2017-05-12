import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { AppState, Player } from '../../models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PlayersService } from '../../services/players.service';

@Component({
  selector: 'ow-heroes',
  templateUrl: 'heroes.component.html',
  styleUrls: [ 'heroes.component.scss' ]
})
export class HeroesComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('platform') platformInput;
  @ViewChild('region') regionInput;
  @ViewChild('mode') modeInput;
  @ViewChild('role') roleInput;
  @ViewChild('search') searchInput;
  @ViewChild('heroesTable') table: any;
  playerData$: Observable<AppState>;
  players: Player[];
  player: Player;
  questionForm: FormGroup;
  subscriptions: Subscription[] = [];
  rows: any[] = [];

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

  roles = [ 'OFFENSE', 'DEFENSE', 'TANK', 'SUPPORT' ];
  platforms = [ 'PC', 'MAC', 'X-Box', 'PlayStation' ];
  regions = [ 'US', 'Europe', 'Asia', 'South America', 'Africa', 'Australia' ];
  modes = [ 'Escort', 'Assault', 'Hybrid', 'Control' ];

  constructor(private store: Store<AppState>, private service: PlayersService) {}

  ngOnInit() {
    this.questionForm = new FormGroup({});
    this.playerData$ = this.store.select(players => players);
    this.playerData$.subscribe(p => this.players = p.players);
    this.playerData$.subscribe(p => this.player = p.playerData);

    this.playerData$.subscribe(players => {
        if (!players) {
          this.service.loadData();
        }
      });
  }

  ngAfterContentInit() {
    console.log('player', this.player);

    this.platformInput.initControl(this.questionForm, this.platform, this.platformName, this.platformName, this.platforms);
    this.regionInput.initControl(this.questionForm, this.region, this.regionName, this.regionName, this.regions);
    this.modeInput.initControl(this.questionForm, this.mode, this.modeName, this.modeName, this.modes);
    this.roleInput.initControl(this.questionForm, this.role, this.roleName, this.roleName, this.roles);
    this.searchInput.initControl(this.questionForm, this.search, this.searchName, this.searchControl, this.searchPlaceholder, false);
    this.mapFormToModel();

    this.rows = this.player.snapshotStatistics[this.player.snapshotStatistics.length - 1].heroSnapshotStatistics;
  }

  private mapFormToModel() {
    this.platformInput = this.questionForm.getRawValue();
    this.regionInput = this.questionForm.getRawValue();
    this.modeInput = this.questionForm.getRawValue();
    this.roleInput = this.questionForm.getRawValue();
    this.searchInput = this.questionForm.getRawValue();
  }

  searchPlayer() {
    
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
