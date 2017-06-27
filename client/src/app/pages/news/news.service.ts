import {Injectable} from '@angular/core'
import gql from 'graphql-tag'
import {Apollo} from 'apollo-angular'
import {Store, Dispatcher} from '@ngrx/store'
import {Observable} from 'rxjs/Observable'

import {map, merge, complement, reverse, isNil} from 'ramda'

import {getBlogPosts} from '../../reducers'
import {BlogPost, AppState} from '../../models'

@Injectable()
export class NewsService {
  public posts$: Observable<BlogPost[]>

  constructor(private apollo: Apollo, private store: Store<AppState>, private dispatcher: Dispatcher) {
    this.posts$ = this.store
      .select('blogPosts')
      .filter(complement(isNil))
      .map(Object.values)
      .map(reverse)
  }

  public getLatestPosts(last = 6) {
    this.apollo.query<{blogPosts: BlogPost[]}>({
      query: gql`
        query BlogPostQuery($last: Int) {
          blogPosts(last: $last) {
            id
            title
            content
            insertedAt
            updatedAt
          }
        }
      `, // After add author and imageUrl
      variables: {last}
    })
      .map(res => res.data.blogPosts)
      .map(map(merge({imageUrl: '//placehold.it/500x500', author: { username: 'Bill Nye' }})))
      .subscribe((posts) => this.dispatcher.dispatch(getBlogPosts(posts)))
  }
}
