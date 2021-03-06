import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ow-hero-card-body',
  templateUrl: 'hero-card-body.component.html',
  styleUrls: [ 'hero-card-body.component.scss' ]
})

export class HeroCardBodyComponent implements OnInit {
  @Input() hero: any;

  constructor() {}

  ngOnInit() {}

}
