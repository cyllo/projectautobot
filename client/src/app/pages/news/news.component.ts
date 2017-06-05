import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import {take, drop, applySpec} from 'ramda'

import {NewsService} from './news.service'

export const firstTwo = take(2)
export const allButFirstTwo = drop(2)
export const getHighlightPosts = applySpec({firstCouple: firstTwo, rest: allButFirstTwo})

@Component({
  selector: 'ow-news',
  templateUrl: 'news.component.html',
  styleUrls: ['news.component.scss'],
  providers: [NewsService]
})
export class NewsComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('category') categoryInput;
  @ViewChild('archive') archiveInput;
  questionForm: FormGroup;
  subscriptions: Subscription[] = [];

  // private category;
  // public catFieldName = 'categories';
  // private catControlName = 'categories';
  // private categoryList: Array<string> = ['All', 'Offense', 'Defense', 'Tank', 'Support'];

  // private archive;
  // public archiveFieldName = 'archives';
  // private archiveControlName = 'archives';
  // private archiveList: Array<string> = [
  //   'Most Recent',
  //   'Last Month',
  //   'Last 3 Months',
  //   'Last 6 Months',
  //   'Last Year',
  //   'All Time'
  // ];

  throttle = 300;
  scrollDistance = 1;

  constructor(public news: NewsService) {
  }

  ngOnInit() {
    this.questionForm = new FormGroup({});

    this.news.getLatestPosts()
  }

  ngAfterContentInit() {
    // this.categoryInput.initControl(
    //   this.questionForm,
    //   this.category,
    //   this.catFieldName,
    //   this.catControlName,
    //   this.categoryList
    // );

    // this.archiveInput.initControl(
    //   this.questionForm,
    //   this.archive,
    //   this.archiveFieldName,
    //   this.archiveControlName,
    //   this.archiveList
    // );

    // this.mapFormToModel();
  }

  // private mapFormToModel() {
  //   this.categoryInput = this.questionForm.getRawValue();
  //   this.archiveInput = this.questionForm.getRawValue();
  // }

  // addItems(startIndex, endIndex) {
  //   for (let i = startIndex; i < endIndex; i++) {
  //     this.newsData.push(this.newsArticle);
  //   }
  // }

  // onScroll() {
  //   const start = this.sum;

  //   this.sum += 2;
  //   this.addItems(start, this.sum);
  // }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
