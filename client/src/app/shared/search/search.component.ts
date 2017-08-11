import { Component, OnInit, OnDestroy, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { trim, isEmpty } from 'ramda';

@Component({
  selector: 'ow-search',
  templateUrl: './search.component.html',
  styleUrls: ['search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input('searchInProgress') searchInProgress: boolean;
  @Input('placeholder') placeholder: string;
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();

  searchForm: FormGroup;
  private subscription: Subscription;

  constructor() {}

  ngOnInit() {
    this.searchForm = new FormGroup({ searchFormInput: new FormControl('') });
    this.subscription = this.searchForm.controls.searchFormInput.valueChanges
      .debounceTime(500)
      .filter((str: string) => !isEmpty(str))
      .map((str: string) => trim(str))
      .subscribe((str: string) => {
        if ( str.length > 3 ) {
          this.emitSearch(str);
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  emitSearch(str: string) {
    this.onSearch.emit(str);
  }

}
