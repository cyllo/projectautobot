import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {
  videoUrl = 'http://img.youtube.com/vi/DWqhXWRaMmU/mqdefault.jpg';
  heroes = [
    {
      id: 1,
      playerImage: this.videoUrl,
      playerName: 'MOONMOONNOW',
      points: 5000,
      viewers: '89,836',
    }, {
      id: 2,
      playerImage: this.videoUrl,
      playerName: 'MOONMOONNOW',
      points: 5000,
      viewers: '500,836',
    }, {
      id: 3,
      playerImage: this.videoUrl,
      playerName: 'MOONMOONNOW',
      points: 5000,
      viewers: '890,836',
    }, {
      id: 4,
      playerImage: this.videoUrl,
      playerName: 'MOONMOONNOW',
      points: 5000,
      viewers: '349,836',
    }
  ];

  constructor() {

  }

  ngOnInit() {
    console.log('Hello Home');
  }

}
