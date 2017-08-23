import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models';
import { UserService, AuthorizationService, ClubService, ErrorHandlerService } from '../../services';
import { merge } from 'ramda';

@Component({
  selector: 'ow-user-registration',
  templateUrl: 'user-registration.component.html',
  styleUrls: ['user-registration.component.scss'],
  providers: [UserService, ClubService, ErrorHandlerService]
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
    private club: ClubService,
    private error: ErrorHandlerService) {
      this.clientId = '6qeqp658bnjufty4c2rfjzvw4buz78x3';
      const { protocol, hostname, port } = window.location;
      this.redirectUri = `${protocol}//${hostname}${port ? ':' + port : ''}/register`;
    }


  ngOnInit() {
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
      (error) => this.onError(error));
  }

  bnetAuth() {
    const baseUrl      = 'https://us.battle.net/oauth/authorize';
    const clientId     = `client_id=${this.clientId}`;
    const responseType = 'response_type=code';
    const redirectUri  = `redirect_uri=${this.redirectUri}`;
    window.location.assign(baseUrl + '?' + clientId + '&' + responseType + '&' + redirectUri);
  }

  onError(error) {
    this.createUserError = true;
    this.error.show(error);
  }

}
