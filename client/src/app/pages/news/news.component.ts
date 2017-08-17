import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BlogPost, NewsPageState } from '../../models';
import { BlogPostsService } from '../../services';
import { reverse, isEmpty } from 'ramda';

@Component({
  selector: 'ow-news',
  templateUrl: 'news.component.html',
  styleUrls: ['news.component.scss'],
  providers: [BlogPostsService]
})
export class NewsComponent implements OnInit {

  blogPosts: Observable<BlogPost[]>;
  state: NewsPageState;

  private newsPosts$: Subject<NewsPageState> = new Subject<NewsPageState>();

  constructor(private blogPostsService: BlogPostsService) {}

  ngOnInit() {

    this.newsPosts$
      .distinctUntilChanged((a: NewsPageState, b: NewsPageState) =>
        a.category     !== b.category ||
        b.reverseOrder !== b.reverseOrder)
      .subscribe((state: NewsPageState) => this.updatePageState(state));

    this.newsPosts$.next(this.state = {
      category: 0,
      reverseOrder: true,
      postsPerPage: 8
    });
    this.blogPostsService.getBlogPostsAfter(this.state.postsPerPage);
  }

  onPageStateChange(state: NewsPageState) {
    this.newsPosts$.next(state);
  }

  updatePageState(state: NewsPageState) {
    const {reverseOrder} = state;
    this.blogPosts = this.blogPostsService.posts$
      .filter(arr => !isEmpty(arr))
      .map(blogPosts => reverseOrder ? blogPosts : reverse(blogPosts));
  }

  onScrollUp(state) {
    console.log('scrolled up event', state);
  }

  onScrollDown(state) {
    console.log('scrolled down event', state);
  }


}
