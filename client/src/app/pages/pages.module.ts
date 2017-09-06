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
import { MomentModule } from 'angular2-moment';
import { RouterModule } from '@angular/router';
import { MdInputModule,
         MdButtonModule,
         MdCardModule,
         MdSnackBarModule,
         MdTabsModule,
         MdIconModule,
         MdListModule,
         MdSelectModule,
         MdProgressSpinnerModule,
         MdChipsModule,
         MdSlideToggleModule,
         MdTooltipModule,
         MdToolbarModule,
         MdTableModule,
         MdRadioModule,
         MdButtonToggleModule,
         MdCheckboxModule,
         MdProgressBarModule } from '@angular/material';

import {
  HomeComponent,
  FollowingComponent,
  FollowedUserComponent,
  GamerTagCardComponent,
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
  LifetimeStatsComponent,
  ProfileHeaderComponent,
  MostPlayedComponent,
  HeroSkillsComponent,
  HeroPageTabsComponent,
  HeroCareerComponent,
  ProfileOverviewComponent,
  HeroWallCatalogComponent,
  CompareComponent,
  ComparedProfilesComponent,
  StatCategoryBlockComponent,
  HeroesHeaderComponent,
  HeroesTableComponent,
  PageNotFoundComponent,
  LoginComponent,
  NewsPageStateComponent,
  PostEntryComponent,
  UserRegistrationComponent,
  AccountSettingsComponent,
  ListOfCompareableHeroesComponent,
  SkillRatingTrendComponent,
  LeaderboardHeaderComponent,
  LeaderboardTableComponent,
  LeaderboardChartComponent,
  HeroesChartComponent,
  RecentlyPlayedComponent,
  OverallPerformanceComponent,
<<<<<<< HEAD
<<<<<<< HEAD
  RolePerformanceComponent,
  RecentSessionComponent,
  HeroCardsComponent
=======
  RolePerformanceComponent
>>>>>>> wip: profile page
=======
  RolePerformanceComponent,
  RecentSessionComponent
>>>>>>> wip: added recent sessions and role performance
} from './index';

@NgModule({
  imports: [
    RouterModule,
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
    MdSnackBarModule,
    MdTabsModule,
    MdIconModule,
    MdListModule,
    MdSelectModule,
    MdProgressSpinnerModule,
    MomentModule,
    MdChipsModule,
    MdSlideToggleModule,
    MdTooltipModule,
    MdToolbarModule,
    MdTableModule,
    MdRadioModule,
    MdButtonToggleModule,
    MdCheckboxModule,
    MdProgressBarModule
  ],
  declarations: [
    HomeComponent,
    FollowingComponent,
    FollowedUserComponent,
    GamerTagCardComponent,
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
    LifetimeStatsComponent,
    ProfileHeaderComponent,
    MostPlayedComponent,
    HeroSkillsComponent,
    HeroPageTabsComponent,
    HeroCareerComponent,
    ProfileOverviewComponent,
    HeroWallCatalogComponent,
    CompareComponent,
    ComparedProfilesComponent,
    StatCategoryBlockComponent,
    HeroesHeaderComponent,
    HeroesTableComponent,
    PageNotFoundComponent,
    LoginComponent,
    NewsPageStateComponent,
    PostEntryComponent,
    UserRegistrationComponent,
    AccountSettingsComponent,
    ListOfCompareableHeroesComponent,
    SkillRatingTrendComponent,
    LeaderboardHeaderComponent,
    LeaderboardTableComponent,
    LeaderboardChartComponent,
    HeroesChartComponent,
    RecentlyPlayedComponent,
    OverallPerformanceComponent,
    RolePerformanceComponent,
    RecentSessionComponent,
    HeroCardsComponent
  ],
  exports: [
    HomeComponent,
    FollowingComponent,
    FollowedUserComponent,
    GamerTagCardComponent,
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
    LifetimeStatsComponent,
    ProfileHeaderComponent,
    MostPlayedComponent,
    HeroSkillsComponent,
    HeroPageTabsComponent,
    HeroCareerComponent,
    LoginComponent,
    UserRegistrationComponent,
    AccountSettingsComponent,
    LeaderboardHeaderComponent,
    LeaderboardTableComponent,
    LeaderboardChartComponent,
    HeroesChartComponent,
    OverallPerformanceComponent,
    RolePerformanceComponent,
    RecentSessionComponent,
    HeroCardsComponent
  ]
})

export class PagesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PagesModule
    };
  }
}
