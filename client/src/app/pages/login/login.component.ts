import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthorizationService } from '../../services';
import { Credentials, AppState } from '../../models';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { path } from 'ramda';

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
    private store: Store<AppState>,
    private location: Location) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit(credentials: Credentials) {
    this.authorizationService.login(credentials)
      .subscribe(({ data }) => {
        console.log(data);
        // const { loginUser: { user: session } } = data;
        const session = path(['loginUser', 'user'], data);
        this.store.dispatch({ type: 'AUTH', payload: session });
        this.loginError = false;
        this.location.back();
      }, () => this.loginError = true);
  }
}
