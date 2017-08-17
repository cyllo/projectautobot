import { merge } from 'ramda';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService, AuthorizationService, ClubService } from '../../services';
import { User } from '../../models';
import { ActivatedRoute, Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

const DISPLAY_NAME_REGEX = /^[A-Za-z\s.\(\)0-9]{3,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PASSWORD_REGEX = /^(?=.*[a-z]+.*)(?=.*[A-Z]+.*)(?=.*[0-9]+.*)(.{8,})$/;

@Component({
  selector: 'ow-user-registration',
  templateUrl: 'user-registration.component.html',
  styleUrls: ['user-registration.component.scss'],
  providers: [UserService, ClubService]
})

export class UserRegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  createUserError: boolean;
  clientId: string;
  redirectUri: string;
  bnetCode: string;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private authorizationService: AuthorizationService,
    private router: Router,
    private snackBar: MdSnackBar,
    private club: ClubService) {
      this.clientId = '6qeqp658bnjufty4c2rfjzvw4buz78x3';
      this.redirectUri = 'https://localhost:8080/register';
    }


  ngOnInit() {
    this.registrationForm = new FormGroup({
      displayName: new FormControl('', [Validators.required, Validators.pattern(DISPLAY_NAME_REGEX)]),
      password: new FormControl('', [Validators.required, Validators.pattern(PASSWORD_REGEX)]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)])
    });

    this.activatedRoute.queryParams
    .filter(({ code }) => code)
    .map(({ code }) => code)
    .subscribe(val => {
      this.bnetCode = val;
    });

  }

  onSubmit(newUser: User) {
    const { email, password } = newUser;

    this.userService.create(merge(newUser, { clientAuthToken: this.bnetCode }))
      .switchMap(() => this.authorizationService.login({ email, password }))
      .do(() => this.club.create('General'))
      .subscribe(() => {
        this.createUserError = false;
        this.router.navigate(['./news']);
      },
      () => this.onError());
  }

  bnetAuth() {
    const authUrl = `https://us.battle.net/oauth/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${this.redirectUri}`;
    window.location.assign(authUrl);
  }

  onError() {
    this.createUserError = true;
    this.snackBar.open('Problem creating account, try again.', 'ok', {
      duration: 5000
    });
  }

}
