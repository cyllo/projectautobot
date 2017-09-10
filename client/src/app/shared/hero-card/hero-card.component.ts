import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ow-hero-card',
  templateUrl: 'hero-card.component.html',
  styleUrls: ['hero-card.component.scss']
})

export class HeroCardComponent implements OnInit {
  @Input() hero: any;
  constructor() {}

  ngOnInit() {}

}
