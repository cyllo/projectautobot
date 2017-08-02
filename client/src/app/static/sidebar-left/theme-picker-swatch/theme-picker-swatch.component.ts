import { Component, Input } from '@angular/core';
import { AppTheme } from '../../../services';

@Component({
  selector: 'ow-theme-picker-swatch',
  templateUrl: 'theme-picker-swatch.component.html',
  styleUrls: [ 'theme-picker-swatch.component.scss' ]
})

export class ThemePickerSwatchComponent {
  @Input('theme') theme: AppTheme;

  constructor() {}


}
