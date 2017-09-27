import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ow-hero-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})
export class HeroHeaderComponent {
  @Input() hero: Observable<any>;
  @Input() heroStats: Observable<any>;

  constructor() {}

}
