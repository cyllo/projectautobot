import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Heroes } from '../../models';

@Component({
  selector: 'ow-hero-checkbox',
  templateUrl: 'hero-checkbox.component.html',
  styleUrls: ['hero-checkbox.component.scss']
})
export class HeroCheckboxComponent {
  @Input() hero: Heroes;
  @Output() selectedChange = new EventEmitter<boolean>();
  selectedValue = true;

  @Input()
  get selected() {
    return this.selectedValue;
  }
  set selected(value) {
    this.selectedValue = value;
    this.selectedChange.emit(this.selectedValue);
  }

  constructor () {}

}
