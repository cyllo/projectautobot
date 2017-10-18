import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { DragulaModule } from 'ng2-dragula';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';
import { MdSidenavModule,
         MdButtonModule,
         MdMenuModule,
         MdListModule,
         MdTooltipModule,
         MdTabsModule,
         MdInputModule,
         MdCardModule,
         MdSnackBarModule,
         MdToolbarModule,
         MdIconModule,
         MdProgressSpinnerModule,
         MdCheckboxModule,
         MdExpansionModule,
         MdRadioModule } from '@angular/material';

import { PerfectScrollbarModule } from 'angular2-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'angular2-perfect-scrollbar';
import { ApolloModule } from 'apollo-angular';
import { ApolloClient } from 'apollo-client';
import { values } from 'ramda';
import { MomentModule } from 'angular2-moment';

import { httpInterceptor } from './app.http-interceptor';
import { BlogPostResolver } from './pages/resolvers';
import { AppComponent } from './app.component';
import * as staticComponents from './static';
import { routing } from './app.routing';


import { PipeModule } from './pipes';
import {
  OverwatchHeroDataService,
  AuthorizationService,
  AuthGuard,
  AdminAuthGuard,
  SocketService,
  FriendShipService,
  ProfileService,
  ErrorHandlerService,
  GamerTagService,
  BlogPostsService,
  ClubService,
  SnapshotService,
  TrendsService,
  HeroStatistics } from './services';

import { reducerStack } from './reducers';
import { SharedModule } from './shared';
import { PagesModule } from './pages';
import { ChartsModule } from './charts';

const declarations: any[] = [AppComponent, ...values(staticComponents)];


const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  // suppressScrollX: true
};

@NgModule({
  imports: [
    routing,
    SharedModule.forRoot(),
    PagesModule.forRoot(),
    PipeModule.forRoot(),
    ChartsModule.forRoot(),
    ApolloModule.forRoot(() => new ApolloClient({ networkInterface: httpInterceptor })),
    StoreModule.forRoot(reducerStack),
    StoreDevtoolsModule.instrument({maxAge: 25}),
    StoreRouterConnectingModule,
    BrowserModule,
    MomentModule,
    CommonModule,
    HttpModule,
    JsonpModule,
    FormsModule,
    ReactiveFormsModule,
    MdMenuModule,
    MdSidenavModule,
    MdButtonModule,
    MdListModule,
    MdTooltipModule,
    MdTabsModule,
    MdCardModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MdInputModule,
    DragulaModule,
    MdSnackBarModule,
    PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
    MdToolbarModule,
    MdIconModule,
    MdProgressSpinnerModule,
    MdCheckboxModule,
    MdExpansionModule,
    MdRadioModule
  ],
  declarations,
  providers: [
    GamerTagService,
    ProfileService,
    SocketService,
    OverwatchHeroDataService,
    AuthGuard,
    AdminAuthGuard,
    AuthorizationService,
    ClubService,
    FriendShipService,
    BlogPostsService,
    BlogPostResolver,
    ErrorHandlerService,
    SnapshotService,
    TrendsService,
    HeroStatistics
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) { }

  hmrOnDestroy(store) {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
