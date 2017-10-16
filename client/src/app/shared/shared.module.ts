import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { MomentModule } from 'angular2-moment';
import { MdIconModule,
         MdProgressSpinnerModule,
         MdButtonModule,
         MdCardModule,
         MdChipsModule,
         MdSlideToggleModule,
         MdProgressBarModule,
         MdTooltipModule,
         MdRadioModule,
         MdSliderModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PipeModule } from '../pipes';

import {
  ApiService,
  VideoCardComponent,
  SearchComponent,
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
  HeroListComponent,
  ProfileCheckboxComponent,
  HeroCheckboxComponent,
  GameModeIndicatorComponent,
  PlayerProfileButtonComponent
} from './index';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    PipeModule.forRoot(),
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
    MdChipsModule,
    MdSlideToggleModule,
    MdProgressBarModule,
    MdTooltipModule,
    MdRadioModule,
    MdSliderModule
  ],
  declarations: [
    VideoCardComponent,
    SearchComponent,
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
    HeroListComponent,
    ProfileCheckboxComponent,
    HeroCheckboxComponent,
    GameModeIndicatorComponent,
    PlayerProfileButtonComponent
  ],
  exports: [
    VideoCardComponent,
    SearchComponent,
    RoleComponent,
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
    HeroListComponent,
    ProfileCheckboxComponent,
    HeroCheckboxComponent,
    GameModeIndicatorComponent,
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
