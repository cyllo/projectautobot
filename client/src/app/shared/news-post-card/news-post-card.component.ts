import { Component, OnInit, Input , AfterViewInit } from '@angular/core';

import { BlogPost } from '../../models';

@Component({
  selector: 'ow-news-post-card',
  templateUrl: 'news-post-card.component.html',
  styleUrls: ['news-post-card.component.scss']
})
export class NewsPostCardComponent implements OnInit, AfterViewInit {
  @Input() post: BlogPost;
  @Input() featuredPost: boolean;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {}

}
