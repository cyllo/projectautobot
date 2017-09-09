import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { reverse } from 'ramda';

import { BlogPostsService } from '../../services/blog-posts.service';
import { BlogPost, PaginationParams } from '../../models';

import { NewsFilters } from './metadata';


@Injectable()
export class NewsService {
  constructor(private blogPostsService: BlogPostsService) { }

  fetchBlogPosts(filters: NewsFilters, pagination: PaginationParams): Observable<BlogPost[]> {
    const blogPosts$ = this.getBlogPosts(filters, pagination)
      .mergeMapTo(this.blogPostsService.posts$);

    return filters.isDisplayingLatest ? blogPosts$.map(reverse) : blogPosts$;
  }

  private getBlogPosts(filters: NewsFilters, pagination: PaginationParams) {
    if (filters.isDisplayingLatest) {
      return this.blogPostsService.getLatestPosts(pagination);
    } else {
      return this.blogPostsService.getOldestPosts(pagination);
    }
  }
}
