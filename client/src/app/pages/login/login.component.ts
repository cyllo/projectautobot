import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthorizationService } from '../../services';
import { Credentials } from '../../models';
import { Location } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { compose, not, isNil } from 'ramda';

const notNil = compose(not, isNil);

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'ow-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
  providers: [AuthorizationService]
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginForm$ = new Subject<Credentials>();

  constructor(
    private authorizationService: AuthorizationService,
    private location: Location
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]),
      password: new FormControl('', [Validators.required])
    });

    this.loginForm$
    .switchMap(credentials => this.authorizationService.login(credentials))
    .filter(notNil)
    .subscribe(() => this.location.back());
  }
}
