import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MomentModule } from 'angular2-moment';
import { MdIconModule,
         MdProgressSpinnerModule,
         MdButtonModule,
         MdCardModule,
         MdChipsModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import {
  ApiService,
  VideoCardComponent,
  SearchComponent,
  ScheduleComponent,
  RoleComponent,
  NewsPostCardComponent,
  ImageComponent,
  PageSpinnerComponent,
  SelectComponent,
  HeroCardComponent,
  HeroCardHeaderComponent,
  HeroCardBodyComponent,
  ChartComponent,
  PlatformRegionComponent,
  HeroSkillVideoComponent,
  HeroSkillDescriptionComponent,
  HeroSynergyCounterComponent,
  HeroPortraitComponent,
  HeroCatalogComponent,
  TopNewsComponent,
  TopNewsPostCardComponent,
  ProfileCheckboxComponent,
  HeroCheckboxComponent,
  CompetitiveOrQuickPlaySelectorComponent,
  PlayerProfileButtonComponent
} from './index';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    CommonModule,
    HttpModule,
    ChartsModule,
    RouterModule,
    MomentModule,
    MdIconModule,
    MdProgressSpinnerModule,
    MdButtonModule,
    FlexLayoutModule,
    MdCardModule,
    MdChipsModule
  ],
  declarations: [
    VideoCardComponent,
    SearchComponent,
    ScheduleComponent,
    RoleComponent,
    NewsPostCardComponent,
    ImageComponent,
    PageSpinnerComponent,
    SelectComponent,
    HeroCardComponent,
    HeroCardHeaderComponent,
    HeroCardBodyComponent,
    ChartComponent,
    PlatformRegionComponent,
    HeroSkillVideoComponent,
    HeroSkillDescriptionComponent,
    HeroSynergyCounterComponent,
    HeroPortraitComponent,
    HeroCatalogComponent,
    TopNewsComponent,
    TopNewsPostCardComponent,
    ProfileCheckboxComponent,
    HeroCheckboxComponent,
    CompetitiveOrQuickPlaySelectorComponent,
    PlayerProfileButtonComponent
  ],
  exports: [
    VideoCardComponent,
    SearchComponent,
    ScheduleComponent,
    RoleComponent,
    TopNewsComponent,
    NewsPostCardComponent,
    ImageComponent,
    PageSpinnerComponent,
    SelectComponent,
    HeroCardComponent,
    ChartComponent,
    PlatformRegionComponent,
    HeroSkillVideoComponent,
    HeroSkillDescriptionComponent,
    HeroSynergyCounterComponent,
    HeroPortraitComponent,
    HeroCatalogComponent,
    ProfileCheckboxComponent,
    HeroCheckboxComponent,
    CompetitiveOrQuickPlaySelectorComponent,
    PlayerProfileButtonComponent
  ],
  providers: [ApiService]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ApiService]
    };
  }
}
