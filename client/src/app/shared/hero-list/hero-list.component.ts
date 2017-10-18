import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { notEmpty } from '../../services';
import { ReducerStack } from '../../reducers';

@Component({
  selector: 'ow-hero-list',
  templateUrl: 'hero-list.component.html',
  styleUrls: ['hero-list.component.scss']
})
export class HeroListComponent implements OnInit {
  heroes: Observable<any>;

  constructor(
    private store: Store<ReducerStack>
  ) {}

  ngOnInit() {
    this.heroes = this.store.select('heroes').filter(notEmpty);
  }
}
