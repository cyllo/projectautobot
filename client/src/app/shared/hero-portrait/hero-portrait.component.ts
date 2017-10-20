import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../../models';

@Component({
  selector: 'ow-hero-portrait',
  templateUrl: 'hero-portrait.component.html',
  styleUrls: ['hero-portrait.component.scss']
})
export class HeroPortraitComponent implements OnInit {
  @Input() hero: Hero;
  @Input() class: string;



  constructor() {}

  ngOnInit() {}
}
