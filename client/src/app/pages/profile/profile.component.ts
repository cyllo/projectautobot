import { prop, merge, path, find, replace } from 'ramda';
import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { AppState, Player } from '../../models';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SnapshotStats } from '../../models/player.model';
import { Observable } from 'rxjs/Observable';
import { ProfileService } from '../../services';

@Component({
  selector: 'ow-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy, AfterContentInit {
  players: Observable<object>;
  player: Observable<Player>;
  selectedPlayer: Observable<object>;

  platform: string;
  region: string;
  tag: string;
  paramsSub;
  selectedSnapshot = new BehaviorSubject('competitive');
  selectedSnapshotData: Observable<SnapshotStats>;

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService
  ) {
    this.players = this.store.select('players');

    this.players.subscribe(x => console.log('store', x));

    this.selectedPlayer = activatedRoute.paramMap.map(paramMap => ({
      tag: paramMap.get('tag'),
      platform: paramMap.get('platform'),
      region: paramMap.get('region')
    }));

    const resolveData: Observable<Player> = activatedRoute.data
      .map(prop<Player>('player'))
      .distinctUntilChanged((newPlayer: Player, oldPlayer: Player) => {
        const firstCombine = newPlayer.tag + newPlayer.platform + newPlayer.region,
              secondCombine = oldPlayer.tag + oldPlayer.platform + oldPlayer.region;

        return firstCombine === secondCombine;
      })
      .withLatestFrom(this.selectedPlayer, (players: any[], selection: Player) => {
        return find((player: Player) => {
          return player.tag === replace('-', '#', selection.tag) &&
          player.region === selection.region && player.platform === selection.platform;
        }, players);
      });

    const socketUpdates: Observable<Player> = activatedRoute.data
      .map(path<number>(['player', 'id']))
      .mergeMap((playerId) => this.profileService.observeChanges(playerId))
      .do((data) => this.store.dispatch({ type: 'UPDATE_PLAYER', payload: data }));

    this.player = Observable.merge(resolveData, socketUpdates)
      .switchMap((player) => {
        console.log('switch map: ', player);
        return this.profileService.addOwData(player);
      })
      .do(player => console.log('after switch', player))
      .map((player: Player) => merge(player, this.profileService.latestStatsSet(player)))
      .map((player: Player) => merge(player, this.profileService.profileStats(player)));

    this.selectedSnapshotData = this.player.combineLatest(this.selectedSnapshot, (player, selectedSnapshot) => {
      return player[selectedSnapshot];
    });
  }

  ngOnInit() {
    this.paramsSub = this.activatedRoute.params
      .subscribe(({ platform, region, tag }: { platform: string, region: string, tag: string }) => {
        this.platform = platform;
        this.region = region;
        this.tag = tag;
      });
  }

  ngAfterContentInit() {
    if (this.tag) {
      this.store.dispatch({ type: 'GET_PLAYER_TAG', payload: { tag: this.tag, searching: false } });
    } else {
      this.router.navigate(['./']);
    }
  }

  toggleSnapshotStats(type: string) {
    this.selectedSnapshot.next(type);
  }

  changePlatformRegion(target: any) {
    let playerStream;
    if (target.region) {
      playerStream = this.players.withLatestFrom(this.selectedPlayer,
        (players: any, selection: any) => path([replace('#', '-', selection.tag), target.platform, target.region], players));
    } else {
      playerStream = this.players.withLatestFrom(this.selectedPlayer,
        (players: any, selection: any) => path([replace('#', '-', selection.tag), target.platform], players));
    }

    playerStream.first().subscribe((player: Player) => {
     this.profileService.goto(player);
    });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.profileService.leaveChangesChannel();
  }
}
