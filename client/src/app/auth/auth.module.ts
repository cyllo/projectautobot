import { ModuleWithProviders, NgModule } from '@angular/core';

import {
  LoginComponent,
  AdminAuthGuard,
  AuthGuard,
  AuthorizationService
} from './index';

@NgModule({
  imports: [],
  declarations: [
    LoginComponent,
    AdminAuthGuard,
    AuthGuard,
    AuthorizationService
  ],
  exports: [
    LoginComponent,
    AdminAuthGuard,
    AuthGuard,
    AuthorizationService
  ]
})

export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule
    };
  }
}
