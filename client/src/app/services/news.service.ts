import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Store, Dispatcher } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { newsPostQuery } from './queries';

import { complement, reverse, isNil } from 'ramda';

import { getBlogPosts } from '../reducers';
import { BlogPost, AppState } from '../models';

@Injectable()
export class NewsService {
  public posts$: Observable<BlogPost[]>;

  constructor(private apollo: Apollo, private store: Store<AppState>, private dispatcher: Dispatcher) {
    this.posts$ = this.store
      .select('blogPosts')
      .filter(complement(isNil))
      .map(Object.values)
      .map(reverse);
  }

  public getLatestPosts(last = 6) {
    this.apollo.query<{ blogPosts: BlogPost[] }>({
      query: newsPostQuery,
      variables: { last }
    })
      .map(res => res.data.blogPosts)
      .subscribe((posts) => this.dispatcher.dispatch(getBlogPosts(posts)));
  }
}
