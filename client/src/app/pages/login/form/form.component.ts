import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credentials } from '../../../models';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PASSWORD_REGEX = /^(?=.*[a-z]+.*)(?=.*[A-Z]+.*)(?=.*[0-9]+.*)(.{8,})$/;

@Component({
  selector: 'ow-user-login-form',
  templateUrl: 'form.component.html',
  styleUrls: ['form.component.scss']
})

export class UserLoginFormComponent implements OnInit {
  @Output() submit: EventEmitter<Credentials> = new EventEmitter<Credentials>();

  loginForm: FormGroup;

  constructor() {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]),
      password: new FormControl('', [Validators.required, Validators.pattern(PASSWORD_REGEX)])
    });
  }

  onSubmit(credentials: Credentials) {
    this.submit.emit(credentials);
  }

}
