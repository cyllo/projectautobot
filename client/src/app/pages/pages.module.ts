import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MdInputModule,
         MdButtonModule,
         MdCardModule,
         MdSnackBarModule } from '@angular/material';

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
  HeroWallCatalogComponent,
  CompareComponent,
  ComparedProfilesComponent,
  StatCategoryBlockComponent,
  HeroesHeaderComponent,
  HeroesTableComponent,
  PageNotFoundComponent,
  LoginComponent,
  NewsPageHeaderComponent,
  PostEntryComponent,
  PostUserActionsComponent,
  UserRegistrationComponent,
  AccountSettingsComponent,
  ListOfCompareableHeroesComponent
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
    InfiniteScrollModule,
    FlexLayoutModule,
    MdInputModule,
    MdButtonModule,
    MdCardModule,
    MdSnackBarModule
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
    HeroWallCatalogComponent,
    CompareComponent,
    ComparedProfilesComponent,
    StatCategoryBlockComponent,
    HeroesHeaderComponent,
    HeroesTableComponent,
    PageNotFoundComponent,
    LoginComponent,
    NewsPageHeaderComponent,
    PostEntryComponent,
    PostUserActionsComponent,
    UserRegistrationComponent,
    AccountSettingsComponent,
    ListOfCompareableHeroesComponent
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
    ProfilePageTabsComponent,
    LoginComponent,
    UserRegistrationComponent,
    AccountSettingsComponent
  ]
})

export class PagesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PagesModule
    };
  }
}
