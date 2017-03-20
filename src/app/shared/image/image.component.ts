import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ow-image',
  templateUrl: 'image.component.html',
  styleUrls: ['image.component.scss']
})
export class ImageComponent implements OnInit {
  @Input() hero;

  constructor() {
    // Do stuff
  }

  setimage() {
    return 'url(' + this.hero.playerImage + ')';
  }

  ngOnInit() {
    console.log('Hello Image');
  }

}
