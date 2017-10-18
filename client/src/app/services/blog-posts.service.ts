import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { complement, values, isNil } from 'ramda';
import { blogPost, blogPosts } from './queries';
import { addBlogPost, getBlogPosts, ReducerStack } from '../reducers';
import { BlogPost, BlogPostFilterParams, GraphqlResponse, BlogCategories, PaginationParams } from '../models';
import { convertToGlobalQueryFilters, convertToGlobalQueryLatestFilters } from '../helpers/models';
import { createBlogPost, blogCategories } from '../services/queries';

@Injectable()
export class BlogPostsService {

  public posts$: Observable<BlogPost[]>;

  constructor(private apollo: Apollo, private store: Store<ReducerStack>) {
    this.posts$ = this.store
      .select('blogPosts')
      .filter(complement(isNil))
      .map(posts => values(posts));
  }

  public getBlogPostByTitle(title: string) {
    return this.apollo.query<{ blogPost: BlogPost }>({
      query: blogPost,
      variables: { title }
    })
      .map(({ data: { blogPost: post } }: GraphqlResponse) => post)
      .do(post => this.store.dispatch(addBlogPost(post)));
  }

  public getBlogPosts(variables: BlogPostFilterParams): Observable<BlogPost[]> {
    return this.apollo.query<{ blogPosts: BlogPost[] }>({
      query: blogPosts,
      variables
    })
      .map(({ data: { blogPosts: posts } }: GraphqlResponse) => posts)
      .do(posts => this.store.dispatch(getBlogPosts(posts)));
  }

  public getLatestPosts(pagination: PaginationParams, params?: BlogPostFilterParams) {
    return this.getBlogPosts(convertToGlobalQueryLatestFilters(pagination, params));
  }

  public getOldestPosts(pagination: PaginationParams, params?: BlogPostFilterParams) {
    return this.getBlogPosts(convertToGlobalQueryFilters(pagination, params));
  }

  public getCategories(): Observable<BlogCategories[]> {
    return this.apollo.query({ query: blogCategories })
      .map(({ data: { blogCategories: categories } }: GraphqlResponse) => categories);
  }

  public createPost(variables: BlogPost): Observable<BlogPost> {
    return this.apollo.mutate({
      variables,
      mutation: createBlogPost
    })
      .map(({ data: { createBlogPost: post } }: GraphqlResponse) => post)
      .do(post => this.store.dispatch(addBlogPost(post)));
  }
}
