import { Component, Input } from '@angular/core';

@Component({
  selector: 'ow-image',
  templateUrl: 'image.component.html',
  styleUrls: ['image.component.scss']
})
export class ImageComponent {
  @Input() hero;

  constructor() {
    // Do stuff
  }

  setImage() {
    return 'url(' + this.hero.playerImage + ')';
  }

}
