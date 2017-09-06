import { Component, OnInit, Input } from '@angular/core';
import { GamerTag } from '../../../models';

@Component({
  selector: 'ow-profile-header',
  templateUrl: 'header.component.html',
  styleUrls: [ 'header.component.scss' ]
})

export class ProfileHeaderComponent implements OnInit {
  @Input() profile: GamerTag;
  @Input() modeIndicator;
  constructor() {}

  ngOnInit() {
    console.log(this.profile);
  }

}
