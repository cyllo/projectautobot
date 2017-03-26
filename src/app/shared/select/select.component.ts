import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'ow-select',
  templateUrl: 'select.component.html',
  styleUrls: ['select.component.scss']
})
export class SelectComponent implements OnDestroy {
  @Output() save = new EventEmitter();

  public subscriptions: Subscription[] = [];
  public form: FormGroup;
  public control: FormControl;
  public controlName = 'search';

  public fieldName = 'Field Name';
  public items: Array<string>;

  constructor() {}

  initControl(form, value, fieldName, controlName, items) {
    this.form = form;
    this.fieldName = fieldName;
    this.controlName = controlName;
    this.items = items;

    this.control = new FormControl(value);
    this.form.addControl(this.controlName, this.control);

    // subscribe to value changes on the control to emit the save event
    const controlSub = this.control.valueChanges.debounceTime(500).subscribe(() => this.save.emit());

    this.subscriptions.push(controlSub);
  }

  blur() {
    // patch leading/trailing spaces and blank text
    this.control.patchValue(this.control.value);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
