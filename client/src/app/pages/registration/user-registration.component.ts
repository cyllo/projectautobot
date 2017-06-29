import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService, AuthorizationService } from '../../services';
import { User } from '../../models';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'user-registration',
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
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required])
    });

    this.activatedRoute.queryParams
    .filter(({ code }) => code)
    .map(({ code }) => code)
    .subscribe(val => this.bnetCode = val);
  }

  onSubmit(newUser: User) {
    const { username, password } = newUser;

    this.userService.create(newUser)
    .flatMap(() => this.authorizationService.login({ username, password }))
    .flatMap(val => this.bnetCode
      ? this.userService.connectToBattleNet(this.bnetCode)
      : Observable.of<any>(val))
    .subscribe(() => this.router.navigate(['/news']));
  }

  bnetAuth() {
    window.location.assign(`https://us.battle.net/oauth/authorize?clientId=${this.clientId}&response_type=code&redirectUri=${this.redirectUri}`);
  }
}
