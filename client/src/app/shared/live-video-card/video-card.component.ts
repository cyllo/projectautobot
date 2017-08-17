import { Component, Input } from '@angular/core';

@Component({
  selector: 'ow-video-card',
  templateUrl: 'video-card.component.html',
  styleUrls: ['video-card.component.scss']
})
export class VideoCardComponent {
  @Input() hero;

  constructor() {
    // Do stuff
  }

}
