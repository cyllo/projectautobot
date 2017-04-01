import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ow-video-card',
  templateUrl: 'video-card.component.html',
  styleUrls: ['video-card.component.scss']
})
export class VideoCardComponent implements OnInit {
  @Input() hero;

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello video-card');
  }

}
