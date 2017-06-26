import { Component, OnInit, Input , AfterViewInit } from '@angular/core';

import { BlogPost } from '../../models';

@Component({
  selector: 'ow-news-card',
  templateUrl: 'news-card.component.html',
  styleUrls: ['news-card.component.scss']
})
export class NewsCardComponent implements OnInit, AfterViewInit {
  @Input() post: BlogPost;
  @Input() featuredPost: boolean;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {}

}
