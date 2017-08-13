import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { values, reverse, isEmpty } from 'ramda';
import { AppState, BlogPost } from '../../models';
import { BlogPostsService } from '../../services';

@Component({
  selector: 'ow-news',
  templateUrl: 'news.component.html',
  styleUrls: ['news.component.scss'],
  providers: [BlogPostsService]
})
export class NewsComponent implements OnInit {

  public blogPosts: Observable<BlogPost[]>;

  constructor(private store: Store<AppState>,
              private blogPostsService: BlogPostsService) {}

  ngOnInit() {
    this.blogPostsService.getBlogPostsAfter(30);
    this.blogPosts = this.store.select('blogPosts')
      .filter(val => !isEmpty(val))
      .map(posts => reverse(values(posts)));
  }

}
