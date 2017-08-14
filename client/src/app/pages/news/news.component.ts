import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BlogPost, NewsPageState } from '../../models';
import { BlogPostsService } from '../../services';
import { reverse, assoc, isEmpty } from 'ramda';

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
        a.category       !== b.category ||
        b.sortDescending !== b.sortDescending ||
        a.postsPerPage   !== b.postsPerPage ||
        a.loadNextPage   !== b.loadNextPage)
      .subscribe((state: NewsPageState) => this.updatePageState(state));

    this.newsPosts$.next(this.state = {
      category: 0,
      sortDescending: true,
      postsPerPage: 30,
      loadNextPage: false
    });
    this.blogPostsService.getBlogPostsAfter(this.state.postsPerPage);
  }

  onPageStateChange(state: NewsPageState) {
    this.newsPosts$.next(state);
  }

  updatePageState(state: NewsPageState) {
    const {sortDescending} = state;
    this.blogPosts = this.blogPostsService.posts$
      .filter(arr => !isEmpty(arr))
      .map(blogPosts => sortDescending ? blogPosts : reverse(blogPosts))
      .do(console.log.bind(console))
      .do(() => this.state = assoc('loadNextPage', false, state));
  }

  onScroll(state) {
    this.newsPosts$.next(assoc('loadNextPage', true, state));
  }


}
