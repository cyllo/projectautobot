import { Component, OnInit, Input } from '@angular/core';

import {BlogPost} from '../../models'

@Component({
  selector: 'ow-news-card',
  templateUrl: 'news-card.component.html',
  styleUrls: ['news-card.component.scss']
})
export class NewsCardComponent implements OnInit {
  @Input() post: BlogPost;

  constructor() {
// Do stuff
  }

  ngOnInit() {
    console.log('Hello news-card');
  }

}
