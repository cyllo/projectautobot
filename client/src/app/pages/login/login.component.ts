import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthorizationService, ErrorHandlerService } from '../../services';
import { Credentials } from '../../models';
import { Location } from '@angular/common';

@Component({
  selector: 'ow-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
  providers: [AuthorizationService, ErrorHandlerService]
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError: boolean;
  constructor(private authorizationService: AuthorizationService,
              private location: Location,
              private error: ErrorHandlerService) {}

  ngOnInit() {
  }

  onSubmit(credentials: Credentials) {
    this.authorizationService.login(credentials)
    .subscribe(() => {
      this.loginError = false;
      this.location.back();
    },
    (error) => this.onError(error));
  }

  onError(error) {
    this.loginError = true;
    this.error.show(error);
  }

}
