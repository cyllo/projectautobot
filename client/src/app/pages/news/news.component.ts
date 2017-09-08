import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { reverse, equals, merge } from 'ramda';

import { BlogPostsService } from '../../services';
import { BlogPost, NewsPageState, PaginationParams } from '../../models';

@Component({
  selector: 'ow-news',
  templateUrl: 'news.component.html',
  styleUrls: ['news.component.scss'],
  providers: [BlogPostsService]
})
export class NewsComponent implements OnInit {
  blogPosts$: Observable<BlogPost[]>;

  newsPageState$: BehaviorSubject<NewsPageState> = new BehaviorSubject<NewsPageState>({
    category: 0,
    isDisplayingLatest: true,
    postsPerPage: 8,
    currentPostId: 0
  });

  constructor(private blogPostsService: BlogPostsService) { }

  ngOnInit() {
    this.blogPosts$ = this.newsPageState$
      .scan(merge)
      .distinctUntilChanged(equals)
      .switchMap((state) => this.fetchBlogPosts(state));
  }

  onPageStateChange(state: NewsPageState) {
    this.newsPageState$.next(state);
  }

  onScrollUp(state) {
    console.log('scrolled up event', state);
  }

  onScrollDown(state) {
    console.log('scrolled down event', state);
  }

  private fetchBlogPosts(state: NewsPageState): Observable<BlogPost[]> {
    if (state.isDisplayingLatest) {
      return this.blogPostsService.getLatestPosts(this.getPaginationParams(state), this.getPostParams(state))
        .map(reverse);
    } else {
      return this.blogPostsService.getOldestPosts(this.getPaginationParams(state), this.getPostParams(state));
    }
  }

  private getPostParams({ category }: NewsPageState) {
    return category ? [{ id: category }] : {};
  }

  private getPaginationParams({ currentPostId, postsPerPage }: NewsPageState): PaginationParams {
    return currentPostId ? { next: postsPerPage, current: currentPostId } : { next: postsPerPage };
  }
}
