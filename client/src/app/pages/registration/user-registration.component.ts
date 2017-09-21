import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, AuthorizationService, ClubService, ErrorHandlerService } from '../../services';
import { merge } from 'ramda';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

const DISPLAY_NAME_REGEX = /^[A-Za-z\s.\(\)0-9]{3,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PASSWORD_REGEX = /^(?=.*[a-z]+.*)(?=.*[A-Z]+.*)(?=.*[0-9]+.*)(.{8,})$/;

@Component({
  selector: 'ow-user-registration',
  templateUrl: 'user-registration.component.html',
  styleUrls: ['user-registration.component.scss'],
  providers: [UserService, ClubService, ErrorHandlerService, AuthorizationService]
})

export class UserRegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  createUserError: boolean;
  clientId: string;
  redirectUri: string;
  bnetCode: Observable<any>;
  registration$ = new Subject<any>();

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private authorizationService: AuthorizationService,
    private router: Router,
    private club: ClubService,
    private error: ErrorHandlerService) {
      this.clientId = process.env.NODE_ENV === 'production'
      ? '6qeqp658bnjufty4c2rfjzvw4buz78x3'
      : 'rzmspedr73m2mgbny5xf3ufqdyvyznxd';
      this.redirectUri = `${window.location.origin}/register`;
    }


  ngOnInit() {
    this.registrationForm = new FormGroup({
      displayName: new FormControl('', [Validators.required, Validators.pattern(DISPLAY_NAME_REGEX)]),
      password: new FormControl('', [Validators.required, Validators.pattern(PASSWORD_REGEX)]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)])
    });

    this.bnetCode = this.activatedRoute.queryParams
    .pluck('code')
    .startWith(null);

    this.registration$.withLatestFrom(this.bnetCode, (newUser, bnetCode) => merge(newUser, { clientAuthToken: bnetCode }))
    .switchMap(newUser => this.userService.create(newUser))
    .switchMap(({ email, password }) => this.authorizationService.login({ email, password }))
    .subscribe(() => {
      this.club.create('General');
      this.createUserError = false;
      this.router.navigate(['./news']);
    }, (error) => {
      this.createUserError = true;
      this.error.show(error);
    });
  }

  bnetAuth() {
    const baseUrl      = 'https://us.battle.net/oauth/authorize';
    const clientId     = `client_id=${this.clientId}`;
    const responseType = 'response_type=code';
    const redirectUri  = `redirect_uri=${this.redirectUri}`;
    window.location.assign(`${baseUrl}?${clientId}&${responseType}&${redirectUri}`);
  }
}
