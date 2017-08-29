import { merge, path, replace, isEmpty, isNil, compose, not } from 'ramda';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState, GamerTag, ProfileKey, GamerTagState } from '../../models';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SnapshotStats } from '../../models/player.model';
import { Observable } from 'rxjs/Observable';
import { ProfileService } from '../../services';

const notNil = compose(not, isNil);

@Component({
  selector: 'ow-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  players: Observable<GamerTagState>;
  selectedProfile: Observable<GamerTag>;
  displayProfile: Observable<GamerTag>;
  profileKey: Observable<ProfileKey>;
  searching: boolean;

  selectedSnapshot = new BehaviorSubject('competitive');
  selectedSnapshotData: Observable<SnapshotStats>;

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.players = this.store.select('profiles').skipWhile(isEmpty);

    this.profileKey = this.activatedRoute.paramMap.map(paramMap => ({
      tag: replace('#', '-', paramMap.get('tag')),
      platform: paramMap.get('platform'),
      region: paramMap.get('region')
    }));

    this.profileKey.subscribe(({ tag, platform, region }) => this.profileService.find(tag, platform, region));

    this.selectedProfile = this.profileKey.combineLatest(this.players, ({ platform, region, tag }, profiles): GamerTag =>
      platform === 'pc' ? <GamerTag>path([tag, platform, region], profiles) : <GamerTag>path([tag, platform], profiles)
    ).filter(notNil);

    this.selectedProfile.subscribe((profile) => this.profileService.observeChanges(profile.id));

    this.displayProfile = this.selectedProfile
    .filter(profile => !isEmpty(profile.snapshotStatistics))
    .map((player: GamerTag) => merge(player, this.profileService.latestStatsSet(player)))
    .map((player: GamerTag) => merge(player, this.profileService.profileStats(player)))
    .startWith(null);

    this.selectedSnapshotData = this.displayProfile
    .skipWhile(notNil)
    .combineLatest(this.selectedSnapshot, (player, selectedSnapshot) => {
      return player[selectedSnapshot];
    });
  }

  toggleSnapshotStats(type: string) {
    this.selectedSnapshot.next(type);
  }

  changePlatformRegion({ platform, region }: { platform: string, region: string }) {
    this.players.withLatestFrom(this.profileKey, (profiles: any, { tag }: ProfileKey) => {
      return platform === 'pc' ? <GamerTag>path([tag, platform, region], profiles) : <GamerTag>path([tag, platform], profiles);
    })
    .first()
    .subscribe((player: GamerTag) => this.profileService.goto(player));
  }

  ngOnDestroy() {
    this.profileService.leaveChangesChannel();
  }
}
