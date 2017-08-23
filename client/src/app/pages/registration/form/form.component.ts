import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../../../models';

const DISPLAY_NAME_REGEX = /^[A-Za-z\s.\(\)0-9]{3,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PASSWORD_REGEX = /^(?=.*[a-z]+.*)(?=.*[A-Z]+.*)(?=.*[0-9]+.*)(.{8,})$/;

@Component({
  selector: 'ow-user-registration-form',
  templateUrl: 'form.component.html',
  styleUrls: ['form.component.scss'],
})

export class UserRegistrationFormComponent implements OnInit {
  @Output() submit: EventEmitter<User> = new EventEmitter<User>();
  @Output() bnet: EventEmitter<void> = new EventEmitter<void>();

  registrationForm: FormGroup;

  constructor() {}

  ngOnInit() {
    this.registrationForm = new FormGroup({
      displayName: new FormControl('', [Validators.required, Validators.pattern(DISPLAY_NAME_REGEX)]),
      password: new FormControl('', [Validators.required, Validators.pattern(PASSWORD_REGEX)]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)])
    });
  }

  onSubmit(user: User) {
    this.submit.emit(user);
  }

  bnetAuth($event) {
    this.bnet.emit();
    $event.preventDefault();
  }

}
