import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-news-reel',
  templateUrl: 'news-reel.component.html',
  styleUrls: ['news-reel.component.scss']
})
export class NewsReelComponent implements OnInit {

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello news-collage');
  }

}
