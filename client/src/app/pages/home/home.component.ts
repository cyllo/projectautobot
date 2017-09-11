import { Component, OnInit, AfterContentInit } from '@angular/core';
import { take } from 'ramda';
import { Observable } from 'rxjs/Observable';

import { BlogPost } from '../../models';
import { BlogPostsService } from '../../services';

@Component({
  selector: 'ow-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})

export class HomeComponent implements OnInit, AfterContentInit {
  public latestNews: Observable<BlogPost[]>;

  constructor(public blogPostService: BlogPostsService) { }

  ngOnInit() {
    this.latestNews = this.blogPostService.getLatestPosts({ next: 3 })
      .mergeMapTo(this.blogPostService.posts$)
      .map(take(3));
  }

  ngAfterContentInit() {
    // Called after ngOnInit when the component's or directive's content has been initialized.
    // Add 'implements AfterContentInit' to the class.
  }

}
