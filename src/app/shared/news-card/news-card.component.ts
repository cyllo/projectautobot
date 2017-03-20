import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ow-news-card',
  templateUrl: 'news-card.component.html',
  styleUrls: ['news-card.component.scss']
})
export class NewsCardComponent implements OnInit {
  @Input() news;

  constructor() {
// Do stuff
  }

  ngOnInit() {
    console.log('Hello news-card');
  }

}
