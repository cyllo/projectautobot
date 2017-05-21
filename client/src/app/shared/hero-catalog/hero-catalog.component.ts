import { Component } from '@angular/core';

@Component({
  selector: 'ow-hero-catalog',
  templateUrl: 'hero-catalog.component.html',
  styleUrls: ['hero-catalog.component.scss']
})
export class HeroCatalogComponent {

  public heroCatalog: Array<any> = [0,1,2,3,4,5,6,7,8,9,10,11];

  constructor() { }

}
