import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { take, drop, applySpec } from 'ramda';

import { NewsService } from './news.service';

export const firstTwo = take(2);
export const allButFirstTwo = drop(2);
export const getHighlightPosts = applySpec({firstCouple: firstTwo, rest: allButFirstTwo});

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

  throttle = 300;
  scrollDistance = 1;

  constructor(public news: NewsService) {
  }

  ngOnInit() {
    this.questionForm = new FormGroup({});

    // this.news.getLatestPosts()
  }

  ngAfterContentInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
