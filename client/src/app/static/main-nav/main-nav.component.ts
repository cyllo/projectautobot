import {
  Component,
  OnInit,
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

export class MainNavComponent implements  OnInit {
  @Input() searchInProgress: boolean;
  @Output() searchTag = new EventEmitter<Action>();

  userLoggedIn = false;
  activeToolbarNavLinks: NavLink[];
  searchPlaceholder = 'Search for player by battle tag, psn or xbox live';

  private currentSession: Observable<Object>;

  constructor(private store: Store<AppState>) {
    this.currentSession = this.store.select('currentSession');
  }

  ngOnInit() {
    this.currentSession.subscribe(session =>
      this.userLoggedIn = !all(isNil, values(path(['sessionInfo'], session))));
  }

  onSearch(tag: string) {
    this.searchTag.emit({ type: 'GET_PLAYER_TAG', payload: { tag: tag, searching: true } });
  }

}
