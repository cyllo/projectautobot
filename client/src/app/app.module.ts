import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { routerReducer, RouterStoreModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreLogMonitorModule, useLogMonitor } from '@ngrx/store-log-monitor';

import { AppComponent } from './app.component';
import { TopNavComponent, SideNavComponent, FooterComponent } from './static';
import {
  HomeComponent,
  FollowingComponent,
  LeaderboardComponent,
  HeroesComponent,
  ESportsComponent,
  LiveComponent,
  NewsComponent,
  FriendsComponent
} from './pages';
import {
  ApiService,
  VideoCardComponent,
  SearchComponent,
  RoleComponent,
  NewsCardComponent,
  ImageComponent,
  SelectComponent
} from './shared';
import { routing } from './app.routing';

import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule } from 'ng-sidebar';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PlayersService } from './services';
import { players, playerData, playerDataCollection } from './reducers';
import { MainNavComponent } from './static/main-nav/main-nav.component';

export function instrumentOptions() {
  return {
    monitor: useLogMonitor({ visible: false, position: 'right' })
  };
}

@NgModule({
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    CommonModule,
    StoreDevtoolsModule.instrumentStore(instrumentOptions),
    StoreLogMonitorModule,
    StoreModule.provideStore({
      playerData: playerData,
      players: players,
      playerDataCollection: playerDataCollection,
      router: routerReducer
    }, {
      playerData: {},
      players: [],
      router: {}
    }),
    RouterStoreModule.connectRouter(),
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    SidebarModule,
    InfiniteScrollModule,
    NgxDatatableModule
  ],
  declarations: [
    AppComponent,
    MainNavComponent,
    TopNavComponent,
    SideNavComponent,
    FooterComponent,
    HomeComponent,
    FollowingComponent,
    LeaderboardComponent,
    HeroesComponent,
    ESportsComponent,
    LiveComponent,
    NewsComponent,
    FriendsComponent,
    VideoCardComponent,
    SearchComponent,
    RoleComponent,
    NewsCardComponent,
    ImageComponent,
    SelectComponent
  ],
  providers: [
    ApiService,
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
