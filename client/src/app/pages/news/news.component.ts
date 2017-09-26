import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { merge, last, prop, compose } from 'ramda';

import { BlogPostsService } from '../../services';
import { BlogPost, PaginationParams } from '../../models';
import { NewsFilters } from './metadata';
import { NewsService } from './news.service';

const RESULTS_PER_PAGE = 8;
const PAGINATION_DEFAULT = { next: RESULTS_PER_PAGE };

const lastPostId = compose<BlogPost[], BlogPost, number>(prop('id'), last);

@Component({
  selector: 'ow-news',
  templateUrl: 'news.component.html',
  styleUrls: ['news.component.scss'],
  providers: [BlogPostsService, NewsService]
})
export class NewsComponent implements OnInit {
  blogPosts$: Observable<BlogPost[]>;

  newsFilters$ = new BehaviorSubject<NewsFilters>({
    isDisplayingLatest: true
  });

  newsPagination$ = new BehaviorSubject<PaginationParams>(PAGINATION_DEFAULT);

  constructor(private newsService: NewsService) { }

  ngOnInit() {
    this.blogPosts$ = Observable.combineLatest(this.newsFilters$, this.newsPagination$)
      .debounceTime(250)
      .switchMap(([newsFilters, paginationParams]) => this.newsService.fetchBlogPosts(newsFilters, paginationParams))
      .do(x => console.log('blog posts:' + x));
  }

  onPageFilterChange(filters: NewsFilters) {
    this.newsFilters$.next(filters);
    this.newsPagination$.next(PAGINATION_DEFAULT);
  }

  onScrollDown(paginationParams: PaginationParams, blogPosts: BlogPost[]) {
    this.newsPagination$.next(merge(paginationParams, {
      current: lastPostId(blogPosts)
    }));
  }
}
