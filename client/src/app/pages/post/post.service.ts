import {Injectable} from '@angular/core'
import gql from 'graphql-tag'
import {Apollo} from 'apollo-angular'
import {Store, Dispatcher} from '@ngrx/store'
import {Observable} from 'rxjs/Observable'
import {Subject} from 'rxjs/Subject'

import {merge} from 'ramda'

import {addBlogPost} from '../../reducers'
import {BlogPost, AppState, BlogPostState} from '../../models'

export function getPostById(id: number) {
  return (observable: Observable<BlogPostState>) => {
    return observable.map((blogState) => blogState[id])
  }
}

@Injectable()
export class PostService {
  public post$: Observable<BlogPost>
  public postId$ = new Subject<number>()

  constructor(
    public dispatcher: Dispatcher,
    private apollo: Apollo,
    store: Store<AppState>
  ) {
    this.post$ = this.postId$
      .switchMap((postId) => store.select('blogPosts').let(getPostById(postId)))
      .distinctUntilChanged()
  }

  public getPost(title) {
    return this.apollo.query<{blogPost: BlogPost}>({
      fetchPolicy: 'cache-first',
      query: gql`
        query BlogPostQuery($title: String!) {
          blogPost(title: $title) {
            id
            title
            content
            insertedAt
            updatedAt
          }
        }
      `, // After add author and imageUrl
      variables: {title: this.slugToTitleCase(title)}
    })
      .map(res => res.data.blogPost)
      .map(merge({imageUrl: '//placehold.it/500x500', author: {username: 'Bill Nye'}}))
      .do((post) => {
        this.postId$.next(post.id)
        this.dispatcher.dispatch(addBlogPost(post))
      })
  }

  private slugToTitleCase(title) {
    return title.split('-').join(' ')
  }
}
