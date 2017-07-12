import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthorizationService } from '../../services';
import { Credentials } from '../../models';
import { Location } from '@angular/common';

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
    private location: Location) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit(credentials: Credentials) {
    this.authorizationService.login(credentials)
    .subscribe(() => {
      this.loginError = false;
      this.location.back();
    }, error => {
      console.log('Login Error: ', error);
      this.loginError = true;
    });
  }
}
