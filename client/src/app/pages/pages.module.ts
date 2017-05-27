import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import {
  HomeComponent,
  FollowingComponent,
  LeaderboardComponent,
  HeroesComponent,
  HeroComponent,
  HeroHeaderComponent,
  ESportsComponent,
  LiveComponent,
  NewsComponent,
  PostComponent,
  FriendsComponent,
  ProfileComponent,
  HeroCardsComponent,
  LifetimeStatsComponent,
  CareerComponent,
  MostPlayedComponent,
  HeroSkillsComponent,
  HeroPageTabsComponent,
  HeroCareerComponent,
  ProfileHeaderComponent,
  ProfilePageTabsComponent,
  HeroWallCatalogComponent
} from './index';

@NgModule({
  imports: [
    NgbModule.forRoot(),
    SharedModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    CommonModule,
    HttpModule,
    NgxDatatableModule,
    InfiniteScrollModule
  ],
  declarations: [
    HomeComponent,
    FollowingComponent,
    LeaderboardComponent,
    HeroesComponent,
    HeroComponent,
    HeroHeaderComponent,
    ESportsComponent,
    LiveComponent,
    NewsComponent,
    PostComponent,
    FriendsComponent,
    ProfileComponent,
    HeroCardsComponent,
    LifetimeStatsComponent,
    CareerComponent,
    MostPlayedComponent,
    HeroSkillsComponent,
    HeroPageTabsComponent,
    HeroCareerComponent,
    ProfileHeaderComponent,
    ProfilePageTabsComponent,
    HeroWallCatalogComponent
  ],
  exports: [
    HomeComponent,
    FollowingComponent,
    LeaderboardComponent,
    HeroesComponent,
    HeroComponent,
    HeroHeaderComponent,
    ESportsComponent,
    LiveComponent,
    NewsComponent,
    PostComponent,
    FriendsComponent,
    ProfileComponent,
    HeroCardsComponent,
    LifetimeStatsComponent,
    CareerComponent,
    MostPlayedComponent,
    HeroSkillsComponent,
    HeroPageTabsComponent,
    HeroCareerComponent,
    ProfileHeaderComponent,
    ProfilePageTabsComponent
  ],
  providers: []
})

export class PagesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PagesModule
    };
  }
}
