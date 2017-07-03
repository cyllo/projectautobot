import { Component } from '@angular/core';

import { BlogPost } from '../../models';

@Component({
  selector: 'ow-top-news',
  templateUrl: 'top-news.component.html',
  styleUrls: ['top-news.component.scss']
})
export class TopNewsComponent {
  public firstTwoPosts: BlogPost[];
  public restOfPosts: BlogPost[];
}
