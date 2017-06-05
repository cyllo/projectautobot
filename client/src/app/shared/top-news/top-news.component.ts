import { Component, Input } from '@angular/core';

import {BlogPost} from '../../models'

@Component({
  selector: 'ow-top-news',
  templateUrl: 'top-news.component.html',
  styleUrls: ['top-news.component.scss']
})
export class TopNewsComponent {
  @Input() public set posts(posts) {
    if (posts) {
      this.firstTwoPosts = posts.slice(0, 2)
      this.restOfPosts = posts.slice(2)
    } else {
      this.firstTwoPosts = []
      this.restOfPosts = []
    }
  }

  public firstTwoPosts: BlogPost[]
  public restOfPosts: BlogPost[]
}
