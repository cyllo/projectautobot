import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ow-most-played',
  templateUrl: 'most-played.component.html',
  styleUrls: ['most-played.component.scss']
})

export class MostPlayedComponent implements OnInit {
  @Input() mostPlayedHeroes: any[];
  derp = [1, 2, 3, 4];

  constructor() {}

  ngOnInit() {}

}
