import { Component, OnInit, Input } from '@angular/core';
import { GamerTag } from '../../../models';

@Component({
  selector: 'ow-profile-career',
  templateUrl: 'career.component.html',
  styleUrls: [ 'career.component.scss' ]
})

export class ProfileCareerComponent implements OnInit {
  @Input() profile: GamerTag;
  @Input() modeIndicator;
  constructor() {}

  ngOnInit() {}

}
