import { Component, ViewChild, AfterViewInit, AfterContentInit, OnDestroy, Renderer2 , EventEmitter, Output , OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../models';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { values, all, isNil, path } from 'ramda';

@Component({
  selector: 'ow-main-nav',
  templateUrl: 'main-nav.component.html',
  styleUrls: ['main-nav.component.scss']
})

export class MainNavComponent implements AfterContentInit, OnDestroy, AfterViewInit, OnInit {
@ViewChild('search') search;
@ViewChild('mainnav') elMainNav;
@Output() searchTag = new EventEmitter<Action>();

  questionForm: FormGroup;
  subscriptions: Subscription[] = [];

  private currentSession: Observable<Object>;
  private player: any;
  private fieldName = 'Search';
  private controlName = 'search';
  private searchPlaceholder = 'Search for player by battle tag, psn or xbox live';

  private elBody;

  userLoggedIn = false;

  private prevScrollY: number;
  private curScrollY: number;
  private _dy: number;

  constructor(private renderer: Renderer2, private store: Store<AppState>) {
    this.currentSession = this.store.select('currentSession');
  }

  ngOnInit() {
    this.prevScrollY = 0;
    this.curScrollY  = 0;
    this._dy = 0;

    this.currentSession.subscribe(session => this.userLoggedIn = !all(isNil, values(path(['sessionInfo'], session))));
  }

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
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private mapFormToModel() {
    this.search = this.questionForm.getRawValue();
  }

  onSearch(tag) {
    this.searchTag.emit({ type: 'GET_PLAYER_TAG', payload: { tag: tag, searching: true } });
  }

  ngAfterViewInit() {
    this.elBody = document.getElementsByTagName('body')[0];
    this.renderer.listen('window', 'scroll'          , (event) => { this.onScroll(event);    });
    // this.renderer.listen('window', 'resize'          , (event) => { this.onResize(event);    });
    this.renderer.listen('window', 'DOMContentLoaded', (event) => { this.onDOMLoaded(event); });
  }

  offsetBodyPadding() {
    let navheight = this.elMainNav.nativeElement.offsetHeight;
    this.elBody.style.paddingTop = navheight + 'px';
  }

  onDOMLoaded(event) {
    this.offsetBodyPadding();
    event.preventDefault();
  }

  onScroll(event) {
    this.curScrollY = window.scrollY;

    let dy = this.prevScrollY - this.curScrollY;
    dy = dy / Math.abs(dy);

    // if scroll direction changed
    if ( this._dy !== dy ) {
      // this.elMainNav.nativeElement.classList.toggle('hidden');
    }

    this._dy = dy;
    this.prevScrollY = window.scrollY;

    this.offsetBodyPadding();
    event.preventDefault();
  }

  onResize(event) {
    this.offsetBodyPadding();
    event.preventDefault();
  }
}
