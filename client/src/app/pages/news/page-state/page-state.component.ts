import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { NewsPageState } from '../../../models';
import { assoc } from 'ramda';

@Component({
  selector: 'ow-page-state',
  templateUrl: 'page-state.component.html',
  styleUrls: ['page-state.component.scss']
})

export class NewsPageStateComponent implements OnInit {
  @Output() change: EventEmitter<NewsPageState> = new EventEmitter<NewsPageState>();

  @Input('state')
  get state(): NewsPageState {
    return this._state;
  }
  set state(state: NewsPageState) {
    this.updateControlsState(this._state = state);
  }

  isDisplayingLatest: boolean;

  private _state: NewsPageState;

  constructor() {}

  ngOnInit() {}

  updateControlsState(state: NewsPageState) {
    this.isDisplayingLatest = state.isDisplayingLatest;
  }

  sortOrderChanged(change, state) {
    this.change.emit(assoc('isDisplayingLatest', change.checked, state));
  }

}
