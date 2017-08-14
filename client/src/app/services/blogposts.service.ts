import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Store, Dispatcher } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { complement, reverse, values, isNil } from 'ramda';
import { blogPostQuery, blogPostsAfterQuery, blogPostsBeforeQuery } from './queries';
import { addBlogPost, getBlogPosts } from '../reducers';
import { BlogPost, AppState, GraphqlResponse } from '../models';

@Injectable()
export class BlogPostsService {

  public posts$: Observable<BlogPost[]>;

  constructor(private apollo: Apollo, private store: Store<AppState>, private dispatcher: Dispatcher) {
    this.posts$ = this.store
      .select('blogPosts')
      .filter(complement(isNil))
      .map(posts => reverse(values(posts)));
  }

  public getBlogPostByTitle(title: string) {
    return this.apollo.query<{ blogPost: BlogPost }>({
      query: blogPostQuery,
      variables: { title }
    })
      .map(( { data: { blogPost: post } }: GraphqlResponse ) => post )
      .do(post => this.dispatcher.dispatch(addBlogPost(post)));
  }

  public getBlogPostsBefore(last: number, before: number) {
    this.apollo.query<{ blogPosts: BlogPost[] }>({
      query: blogPostsBeforeQuery,
      variables: { last , before }
    })
      .map(( { data: { blogPosts: posts } }: GraphqlResponse ) => posts )
      .subscribe(posts => this.dispatcher.dispatch(getBlogPosts(posts)));
  }

  public getBlogPostsAfter(first: number, after = 0) {
    this.apollo.query<{ blogPosts: BlogPost[] }>({
      query: blogPostsAfterQuery,
      variables: { first, after }
    })
      .map(( { data: { blogPosts: posts } }: GraphqlResponse ) => posts )
      .subscribe(posts => this.dispatcher.dispatch(getBlogPosts(posts)));
  }

}
