import { Component, Input } from '@angular/core';

@Component({
  selector: 'ow-profile-checkbox',
  templateUrl: 'profile-checkbox.component.html',
  styleUrls: ['profile-checkbox.component.scss']
})
export class ProfileCheckboxComponent {
  @Input() owTag: string;

  constructor () {}

}
