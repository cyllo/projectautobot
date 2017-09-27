import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../models';
import { Observable } from 'rxjs/Observable';
import { notEmpty } from '../../services';

@Component({
  selector: 'ow-hero-list',
  templateUrl: 'hero-list.component.html',
  styleUrls: ['hero-list.component.scss']
})
export class HeroListComponent implements OnInit {
  heroes: Observable<any>;

  constructor(
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.heroes = this.store.select('heroes').filter(notEmpty);
  }
}
