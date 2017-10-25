import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { MomentModule } from 'angular2-moment';
import { MatIconModule,
         MatProgressSpinnerModule,
         MatButtonModule,
         MatCardModule,
         MatChipsModule,
         MatSlideToggleModule,
         MatProgressBarModule,
         MatTooltipModule,
         MatRadioModule,
         MatSliderModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PipeModule } from '../pipes';

import {
  ApiService,
  SearchComponent,
  PageSpinnerComponent,
  HeroCardComponent,
  HeroCardHeaderComponent,
  HeroCardBodyComponent,
  PlatformRegionComponent,
  HeroPortraitComponent,
  HeroListComponent,
  GameModeIndicatorComponent,
  PlayerProfileButtonComponent,
  NewsPostCardComponent
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
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    FlexLayoutModule,
    MatCardModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatRadioModule,
    MatSliderModule
  ],
  declarations: [
    SearchComponent,
    NewsPostCardComponent,
    PageSpinnerComponent,
    HeroCardComponent,
    HeroCardHeaderComponent,
    HeroCardBodyComponent,
    PlatformRegionComponent,
    HeroPortraitComponent,
    HeroListComponent,
    GameModeIndicatorComponent,
    PlayerProfileButtonComponent
  ],
  exports: [
    SearchComponent,
    NewsPostCardComponent,
    PageSpinnerComponent,
    HeroCardComponent,
    PlatformRegionComponent,
    HeroPortraitComponent,
    HeroListComponent,
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
