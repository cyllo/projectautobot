import { merge, path, replace, isEmpty, isNil, compose, not, any, prop, gte, length, flip } from 'ramda';
import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { GamerTag, ProfileKey, SnapshotStats } from '../../models';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ProfileService, SnapshotService, GamerTagService } from '../../services';
import { Subject } from 'rxjs/Subject';
import { updateProfile, addSnapshots, addProfile, flushSnapshots, addTrends, GamerTagState, ReducerStack } from '../../reducers';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DatePipe } from '@angular/common';


const notNil = compose(not, isNil);

@Component({
  selector: 'ow-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss'],
  providers: [DatePipe]
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

  selectedGameMode$ = new BehaviorSubject<string>('competitive');
  selectedSnapshotData: Observable<SnapshotStats>;
  snapshotDiff: Observable<any>;

  constructor(
    private store: Store<ReducerStack>,
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private snapshotService: SnapshotService,
    private gamerTagService: GamerTagService
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
    .subscribe((player: GamerTag) => {
      this.store.dispatch(flushSnapshots());
      this.profileService.goto(player);
    });

    this.reScrapeProfile$
    .switchMapTo(this.profileKey)
    .switchMap(({ tag, platform, region }) => this.profileService.scrape(tag, platform, region))
    .subscribe(gamerTag => this.store.dispatch(updateProfile(gamerTag)), error => console.log('error', error));

    this.selectedProfile.switchMap(({ id }) => this.gamerTagService.statTrends(id))
    .takeUntil(this.destroyer$)
    .subscribe(trends => this.store.dispatch(addTrends(trends)));

    const flippedGte = flip(gte);
    const hasMultipleSnapshots = compose(flippedGte(2), length, prop('snapshotStatistics'));

    this.snapshotDiff = this.selectedProfile
    .filter(hasMultipleSnapshots)
    .pluck('snapshotStatistics')
    .switchMap(([{ id: snapshotAId }, { id: snapshotBId }]) => this.snapshotService.diff(snapshotAId, snapshotBId))
    .startWith(null);
  }

  ngAfterContentInit() {

    this.selectedProfile
    .switchMap(profile => this.snapshotService.findByGamerTag(profile.id, 20))
    .subscribe(snapshots => this.store.dispatch(addSnapshots(snapshots)));

  }

  ngOnDestroy() {
    this.profileService.leaveChangesChannel();
    this.destroyer$.next();
    this.destroyer$.complete();
  }
}
