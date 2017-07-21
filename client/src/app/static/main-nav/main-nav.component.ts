import {
  Component,
<<<<<<< 93ee6c656f3c102a18e63492f2f855c89097f279
  OnInit,
=======
  ViewChild,
  AfterContentInit,
  OnDestroy,
>>>>>>> feat: global-sidebar / main-nav / search results / login & register page
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../models';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { values, all, isNil, path } from 'ramda';
import { NavLink } from '../../models';

@Component({
  selector: 'ow-main-nav',
  templateUrl: 'main-nav.component.html',
  styleUrls: ['main-nav.component.scss']
})

<<<<<<< 93ee6c656f3c102a18e63492f2f855c89097f279
export class MainNavComponent implements  OnInit {
  @Input() searchInProgress: boolean;
  @Output() searchTag = new EventEmitter<Action>();

  userLoggedIn = false;
  activeToolbarNavLinks: NavLink[];
  searchPlaceholder = 'Search for player by battle tag, psn or xbox live';

  private currentSession: Observable<Object>;

=======
export class MainNavComponent implements AfterContentInit, OnDestroy, OnInit {
@ViewChild('search') search;
@Input() searchInProgress: boolean;
@Output() searchTag = new EventEmitter<Action>();

  questionForm: FormGroup;
  subscriptions: Subscription[] = [];

  private currentSession: Observable<Object>;
  private player: any;
  private fieldName = 'Search';
  private controlName = 'search';
  private searchPlaceholder = 'Search for player by battle tag, psn or xbox live';

  userLoggedIn = false;
  activeToolbarNavLinks: NavLink[];

>>>>>>> feat: global-sidebar / main-nav / search results / login & register page
  constructor(private store: Store<AppState>) {
    this.currentSession = this.store.select('currentSession');
  }

  ngOnInit() {
    this.currentSession.subscribe(session =>
      this.userLoggedIn = !all(isNil, values(path(['sessionInfo'], session))));
  }

<<<<<<< 93ee6c656f3c102a18e63492f2f855c89097f279
  onSearch(tag: string) {
    this.searchTag.emit({ type: 'GET_PLAYER_TAG', payload: { tag: tag, searching: true } });
  }

=======
  ngAfterContentInit() {
    this.questionForm = new FormGroup({});
    // Called after ngOnInit when the component's or directive's content has been initialized.
    // Add 'implements AfterContentInit' to the class.
    this.search.initControl(
      this.questionForm,
      this.player,
      this.fieldName,
      this.controlName,
      this.searchPlaceholder,
      true
    );
    this.mapFormToModel();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private mapFormToModel() {
    this.search = this.questionForm.getRawValue();
  }

  onSearch(tag) {
    this.searchTag.emit({ type: 'GET_PLAYER_TAG', payload: { tag: tag, searching: true } });
  }

  showNavListInToolbar($navLinks: NavLink[]) {
    this.activeToolbarNavLinks = $navLinks;
  }

  hideNavListInToolbar() {
    this.activeToolbarNavLinks = null;
  }

>>>>>>> feat: global-sidebar / main-nav / search results / login & register page
}
