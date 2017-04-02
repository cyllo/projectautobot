import { Component, Output } from '@angular/core';
import '../style/app.scss';

@Component({
  selector: 'ow-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @Output() playerData: Object;

  constructor() {
    this.fetch((data) => {
      this.playerData = data;
    });
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `/temp/heroesData.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }
}
