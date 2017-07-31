import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { routerReducer, RouterStoreModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreLogMonitorModule, useLogMonitor } from '@ngrx/store-log-monitor';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule } from 'ng2-dragula';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
         MdProgressSpinnerModule } from '@angular/material';
import { CovalentExpansionPanelModule } from '@covalent/core';
import { PerfectScrollbarModule } from 'angular2-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'angular2-perfect-scrollbar';

import { ApolloModule } from 'apollo-angular';
import { ApolloClient } from 'apollo-client';
import { httpInterceptor } from './app.http-interceptor';

import { ProfileResolver } from './pages/profile/profile.resolver';
import { GamerTagService, ProfileService } from './services';
import { AppComponent } from './app.component';
import * as staticComponents from './static';
import { routing } from './app.routing';
import { OrderByPipe, ValuesPipe } from './pipes';
import { PlayersService, OverwatchHeroDataService, AuthorizationService, AuthGuard, SocketService } from './services';
import { values } from 'ramda';

import { MomentModule } from 'angular2-moment';

import {
  players,
  playerDataCollection,
  searchPlayerTag,
  heroesData,
  currentHeroData,
  blogPosts,
  currentSession,
  snapshotData,
  friendships
} from './reducers';
import { SharedModule } from './shared';
import { PagesModule } from './pages';

const declarations: any[] = [AppComponent, OrderByPipe, ValuesPipe, ...values(staticComponents)];
export function instrumentOptions() {
  return {
    monitor: useLogMonitor({ visible: false, position: 'right' })
  };
}

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  // suppressScrollX: true
};

@NgModule({
  imports: [
    NgbModule.forRoot(),
    SharedModule.forRoot(),
    PagesModule.forRoot(),
    ApolloModule.forRoot(() => new ApolloClient({ networkInterface: httpInterceptor })),
    StoreDevtoolsModule.instrumentStore(instrumentOptions),
    StoreModule.provideStore({
      players,
      playerDataCollection,
      search: searchPlayerTag,
      heroes: heroesData,
      currentHero: currentHeroData,
      blogPosts,
      currentSession,
      friendships,
      router: routerReducer,
      snapshotStats: snapshotData,
    }, {
      blogPost: {},
      players: [],
      router: {},
      snapshotStats: {}
    }),
    RouterStoreModule.connectRouter(),
    BrowserModule,
    MomentModule,
    CommonModule,
    StoreLogMonitorModule,
    HttpModule,
    JsonpModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
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
    PerfectScrollbarModule,
    PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
    CovalentExpansionPanelModule,
    MdToolbarModule,
    MdIconModule,
    MdProgressSpinnerModule
  ],
  declarations,
  providers: [
    ProfileResolver,
    GamerTagService,
    ProfileService,
    SocketService,
    PlayersService,
    OverwatchHeroDataService,
    AuthGuard,
    AuthorizationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) { }
  hmrOnInit(store) {
    console.log('HMR store', store);
  }
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
