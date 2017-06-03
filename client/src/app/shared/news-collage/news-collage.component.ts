import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ow-news-collage',
  templateUrl: 'news-collage.component.html',
  styleUrls: ['news-collage.component.scss']
})
export class NewsCollageComponent implements OnInit {
  @Input() news;

  constructor() {
// Do stuff
  }

  ngOnInit() {
    console.log('Hello news-collage');
  }

}
