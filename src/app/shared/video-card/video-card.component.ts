import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ow-video-card',
  templateUrl: 'video-card.component.html',
  styleUrls: ['video-card.component.scss']
})
export class VideoCardComponent implements OnInit {
  @Input() hero;
  videoUrl = 'http://img.youtube.com/vi/DWqhXWRaMmU/mqdefault.jpg';

  liveStreamData = {
    playerImage: this.videoUrl,
    playerName: 'MOONMOONNOW',
    points: 5000,
    viewers: '89,836',
  };

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello video-card');
  }

}
