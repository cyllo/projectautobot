import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { routerReducer, RouterStoreModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreLogMonitorModule, useLogMonitor } from '@ngrx/store-log-monitor';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ApolloModule } from 'apollo-angular';
import { ApolloClient } from 'apollo-client';
import { SidebarModule } from 'ng-sidebar';

import { AppComponent } from './app.component';
import {
  TopNavComponent,
  SideBarLeftComponent,
  FooterComponent,
  MainNavComponent,
  MainSearchResultsComponent } from './static';
import { routing } from './app.routing';
import { OrderByPipe } from './pipes';
import { PlayersService } from './services';
import { players, playerData, playerDataCollection, searchPlayerTag } from './reducers';
import { SharedModule } from './shared';
import { PagesModule } from './pages';

export function instrumentOptions() {
  return {
    monitor: useLogMonitor({ visible: false, position: 'right' })
  };
}

@NgModule({
  imports: [
    NgbModule.forRoot(),
    SharedModule.forRoot(),
    PagesModule.forRoot(),
    ApolloModule.forRoot(() => new ApolloClient()),
    StoreDevtoolsModule.instrumentStore(instrumentOptions),
    StoreModule.provideStore({
      playerData: playerData,
      players: players,
      playerDataCollection: playerDataCollection,
      router: routerReducer,
      search: searchPlayerTag
    }, {
      playerData: {},
      players: [],
      router: {},
      search: ''
    }),
    RouterStoreModule.connectRouter(),
    BrowserModule,
    CommonModule,
    StoreLogMonitorModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    SidebarModule,
  ],
  declarations: [
    AppComponent,
    MainNavComponent,
    MainSearchResultsComponent,
    TopNavComponent,
    SideBarLeftComponent,
    FooterComponent,
    OrderByPipe
  ],
  providers: [
    PlayersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}
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
