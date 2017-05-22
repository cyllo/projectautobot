import { HostBinding, Component, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Player, Search } from '../../models';
import { AppState } from '../../models/appstate.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'ow-main-search-results',
  templateUrl: 'main-search-results.component.html',
  styleUrls: ['main-search-results.component.scss']
})
export class MainSearchResultsComponent {
  @Input() searchResults;
  @Input()
  @HostBinding('class.open')
  isOpen: boolean;
  @Output() resultSelect = new EventEmitter<Player>();
  @Output() close = new EventEmitter();

  data$: Observable<AppState>;
  search: Search;

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef, private router: Router) {
    this.data$ = this.store.select(search => search);
    this.data$.subscribe(s => {
      this.search = s.search;
      this.isOpen = this.search.searching;
      this.cd.markForCheck();
    });
  }

  onClose() {
    this.isOpen = false;
  }

  onSelect(result: Player) {
    this.redirect(result);
    this.resultSelect.emit(result);
  }

  redirect(data: Player) {
    this.router.navigate(['./profile', data.region, data.platform, data.tag]);
  }
}
