import { merge } from 'ramda';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService, AuthorizationService } from '../../services';
import { User } from '../../models';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'ow-user-registration',
  templateUrl: 'user-registration.component.html',
  styleUrls: ['user-registration.component.scss'],
  providers: [UserService]
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
    private router: Router) {
      this.clientId = '6qeqp658bnjufty4c2rfjzvw4buz78x3';
      this.redirectUri = 'https://localhost:8080/register';
    }


  ngOnInit() {
    this.registrationForm = new FormGroup({
      displayName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required])
    });

    this.activatedRoute.queryParams
    .filter(({ code }) => code)
    .map(({ code }) => code)
    .subscribe(val => this.bnetCode = val);
  }

  onSubmit(newUser: User) {
    const { email, password } = newUser;

    this.userService.create(merge(newUser, {clientAuthToken: this.bnetCode}))
      .switchMap(() => this.authorizationService.login({ email, password }))
      .subscribe(() => {
        this.createUserError = false;
        this.router.navigate(['/news']);
      },
      error => {
        console.log('User Creation Error: ', error);
        this.createUserError = true;
      });
  }

  bnetAuth() {
    const authUrl = `https://us.battle.net/oauth/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${this.redirectUri}`;
    window.location.assign(authUrl);
  }

}
