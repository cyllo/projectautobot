import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
  ApiService,
  VideoCardComponent,
  SearchComponent,
  ScheduleComponent,
  RoleComponent,
  NewsCardComponent,
  ImageComponent,
  SelectComponent,
  HeroCardComponent,
  ChartComponent,
  PlatformRegionComponent,
  HeroSkillVideoComponent,
  HeroSkillDescriptionComponent,
  HeroSynergyCounterComponent,
  HeroPortraitComponent,
  HeroCatalogComponent,
  TopNewsComponent
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
    RouterModule
  ],
  declarations: [
    VideoCardComponent,
    SearchComponent,
    ScheduleComponent,
    RoleComponent,
    NewsCardComponent,
    ImageComponent,
    SelectComponent,
    HeroCardComponent,
    ChartComponent,
    PlatformRegionComponent,
    HeroSkillVideoComponent,
    HeroSkillDescriptionComponent,
    HeroSynergyCounterComponent,
    HeroPortraitComponent,
    HeroCatalogComponent,
    TopNewsComponent
  ],
  exports: [
    VideoCardComponent,
    SearchComponent,
    ScheduleComponent,
    RoleComponent,
    TopNewsComponent,
    NewsCardComponent,
    ImageComponent,
    SelectComponent,
    HeroCardComponent,
    ChartComponent,
    PlatformRegionComponent,
    HeroSkillVideoComponent,
    HeroSkillDescriptionComponent,
    HeroSynergyCounterComponent,
    HeroPortraitComponent,
    HeroCatalogComponent
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
