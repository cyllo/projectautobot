import { merge, path, replace, isEmpty, isNil, compose, not, any, prop } from 'ramda';
import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { AppState, GamerTag, ProfileKey, GamerTagState, SnapshotStats } from '../../models';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ProfileService, SnapshotService } from '../../services';
import { Subject } from 'rxjs/Subject';
import { updateProfile, addSnapshots, addProfile, flushSnapshots } from '../../reducers';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const notNil = compose(not, isNil);

@Component({
  selector: 'ow-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy, AfterContentInit {
  players: Observable<GamerTagState>;
  selectedProfile: Observable<GamerTag>;
  displayProfile: Observable<GamerTag>;
  profileKey: Observable<ProfileKey>;
  changeProfile$ = new Subject<{ platform: string, region: string }>();
  destroyer$ = new Subject<void>();
  reScrapeProfile$ = new Subject();
  modeIndicator: Observable<{ disabled: boolean, mode: string}>;
  toggleWatching: Observable<any>;

  selectedGameMode$ = new BehaviorSubject<string>('competitive');
  selectedSnapshotData: Observable<SnapshotStats>;

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private snapshotService: SnapshotService
  ) { }

  ngOnInit() {
    this.players = this.store.select('profiles').skipWhile(isEmpty).takeUntil(this.destroyer$);

    this.profileKey = this.activatedRoute.paramMap.map(paramMap => ({
      tag: replace('#', '-', paramMap.get('tag')),
      platform: paramMap.get('platform'),
      region: paramMap.get('region')
    }));

    // loads the desired profile as per route params
    this.profileKey
    .takeUntil(this.destroyer$)
    .subscribe(({ tag, platform, region }) => this.profileService.find(tag, platform, region));

    // gets the selected profiles from the player store
    this.selectedProfile = this.profileKey.combineLatest(this.players, ({ platform, region, tag }, profiles): GamerTag =>
      platform === 'pc' ? <GamerTag>path([tag, platform, region], profiles) : <GamerTag>path([tag, platform], profiles)
    )
    .filter(notNil)
    .takeUntil(this.destroyer$);

    this.modeIndicator = this.selectedProfile.combineLatest(this.selectedGameMode$, (profile, selectedMode) => {
      const isCompNil = compose(isNil, path(['profileSnapshotStatistic', 'profileStatistic', 'competitiveLevel']));
      const disabled = any(isCompNil, profile.snapshotStatistics);
      const mode = disabled ? 'quickPlay' : selectedMode;
      return { disabled, mode };
    })
    .startWith({ disabled: true, mode: 'competitive'});

    // currently selected profile as per the route params
    this.selectedProfile
    .first()
    .switchMap(({ id }) => this.profileService.observeChanges(id))
    .subscribe((profile: GamerTag) => {
      this.store.dispatch(addSnapshots(<SnapshotStats[]>prop('snapshotStatistics', profile)));
      this.store.dispatch(addProfile(profile));
    });

    // seeded with all the good shit.
    this.displayProfile = this.selectedProfile
    .filter(profile => !isEmpty(profile.snapshotStatistics))
    .map((profile: GamerTag) => merge(profile, this.profileService.latestStatsSet(profile)))
    .map((profile: GamerTag) => merge(profile, this.profileService.profileStats(profile)))
    .filter(notNil)
    .takeUntil(this.destroyer$);

    this.changeProfile$.withLatestFrom(this.players, this.profileKey, ({ platform, region }, profiles, { tag }) => {
      return platform === 'pc'
      ? <GamerTag>path([tag, platform, region], profiles)
      : <GamerTag>path([tag, platform], profiles);
    })
    .first()
    .subscribe((player: GamerTag) => {
      this.store.dispatch(flushSnapshots());
      this.profileService.goto(player);
    });

    this.reScrapeProfile$
    .switchMapTo(this.profileKey)
    .switchMap(({ tag, platform, region }) => this.profileService.scrape(tag, platform, region))
    .subscribe(gamerTag => this.store.dispatch(updateProfile(gamerTag)), error => console.log('error', error));
  }

  ngAfterContentInit() {
    this.selectedProfile
    .switchMap(profile => this.snapshotService.findByGamerTag(profile.id, 20))
    .subscribe(snapshots => this.store.dispatch(addSnapshots(snapshots)));

    this.toggleWatching = this.store.select('watchSnapshot').pluck('isActive');

    this.toggleWatching.withLatestFrom(this.displayProfile)
    .switchMap(([isWatching, { id }]) => this.profileService.watch(isWatching, id))
    .subscribe(() => console.log('creating pull'));
  }

  ngOnDestroy() {
    this.profileService.leaveChangesChannel();
    this.destroyer$.next();
    this.destroyer$.complete();
  }
}
