import { Component, OnInit, AfterContentInit } from '@angular/core';
import { AppState, BlogPost } from '../../models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { values, reverse, isEmpty } from 'ramda';

@Component({
  selector: 'ow-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})

export class HomeComponent implements OnInit, AfterContentInit {
  public latestNews: Observable<BlogPost[]>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {

    this.latestNews = this.store.select('blogPosts')
    .filter(val => !isEmpty(val))
    .take(3)
    .map(news => reverse(values(news)));
  }

  ngAfterContentInit() {
    // Called after ngOnInit when the component's or directive's content has been initialized.
    // Add 'implements AfterContentInit' to the class.
  }

}
