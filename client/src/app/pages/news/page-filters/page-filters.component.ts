import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { assoc } from 'ramda';

import { NewsFilters } from '../metadata';

@Component({
  selector: 'ow-page-filters',
  templateUrl: 'page-filters.component.html',
  styleUrls: ['page-filters.component.scss']
})

export class NewsPageFiltersComponent implements OnInit {
  @Output() change: EventEmitter<NewsFilters> = new EventEmitter<NewsFilters>();

  @Input('filters')
  get filters(): NewsFilters {
    return this._filters;
  }
  set filters(filters: NewsFilters) {
    this._filters = filters;

    this.updateControlsState(filters);
  }

  isDisplayingLatest: boolean;

  private _filters: NewsFilters;

  constructor() {}

  ngOnInit() {}

  updateControlsState(filters: NewsFilters) {
    this.isDisplayingLatest = filters.isDisplayingLatest;
  }

  sortOrderChanged(change, filters) {
    this.change.emit(assoc('isDisplayingLatest', change.checked, filters));
  }

}
