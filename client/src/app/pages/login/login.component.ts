import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthorizationService } from '../../services';
import { Credentials } from '../../models';
import { Location } from '@angular/common';
import { MdSnackBar } from '@angular/material';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PASSWORD_REGEX = /^(?=.*[a-z]+.*)(?=.*[A-Z]+.*)(?=.*[0-9]+.*)(.{8,})$/;

@Component({
  selector: 'ow-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
  providers: [AuthorizationService]
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError: boolean;
  constructor(private authorizationService: AuthorizationService,
    private location: Location,
    private snackBar: MdSnackBar) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]),
      password: new FormControl('', [Validators.required, Validators.pattern(PASSWORD_REGEX)])
    });
  }

  onSubmit(credentials: Credentials) {
    this.authorizationService.login(credentials)
    .subscribe(() => {
      this.loginError = false;
      this.location.back();
    }, error => this.onError(error));
  }

  onError(e) {
    console.log('Login Error: ', e);
    this.loginError = true;
    this.snackBar.open('Problem logging in, try again.', 'ok', {
      duration: 5000
    });
  }

}
