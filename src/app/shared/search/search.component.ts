import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { trim } from 'lodash';

@Component({
  selector: 'ow-search',
  templateUrl: './search.component.html',
  styleUrls: ['search.component.scss']
})
export class SearchComponent implements OnDestroy {
  @Output() save = new EventEmitter();

  private subscriptions: Subscription[] = [];
  private form: FormGroup;
  private control: FormControl;
  private controlName = 'search';
  private image: boolean;

  public placeholder = 'Search';
  public fieldName = 'Field Name';

  constructor() {}

  initControl(form, value, fieldName, controlName, placeholder, image) {
    value = trim(value); // trim leading/trailing spaces and blank text
    this.form = form;
    this.placeholder = placeholder;
    this.fieldName = fieldName;
    this.controlName = controlName;
    this.image = image;

    this.control = new FormControl(value);
    this.form.addControl(this.controlName, this.control);

    // subscribe to value changes on the control to emit the save event
    const controlSub = this.control.valueChanges.debounceTime(500).subscribe(() => this.save.emit());

    this.subscriptions.push(controlSub);
  }

  blur() {
    // patch leading/trailing spaces and blank text
    this.control.patchValue(trim(this.control.value));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
