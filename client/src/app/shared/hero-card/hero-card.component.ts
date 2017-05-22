import { AfterContentInit, Component, Input } from '@angular/core';
import { HeroSnapshotStats } from '../../models/player.model';

@Component({
  selector: 'ow-hero-card',
  templateUrl: 'hero-card.component.html',
  styleUrls: [ 'hero-card.component.scss' ]
})

export class HeroCardComponent implements AfterContentInit {
  @Input() hero: HeroSnapshotStats;

  constructor() {}

  ngAfterContentInit() {}
}
