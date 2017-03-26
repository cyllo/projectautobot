import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ow-news',
  templateUrl: 'news.component.html',
  styleUrls: ['news.component.scss']
})
export class NewsComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('category') categoryInput;
  @ViewChild('archive') archiveInput;
  questionForm: FormGroup;
  subscriptions: Subscription[] = [];

  private category;
  public catFieldName = 'categories';
  private catControlName = 'categories';
  private categoryList: Array<string> = ['All', 'Offense', 'Defense', 'Tank', 'Support'];

  private archive;
  public archiveFieldName = 'archives';
  private archiveControlName = 'archives';
  private archiveList: Array<string> = [
    'Most Recent',
    'Last Month',
    'Last 3 Months',
    'Last 6 Months',
    'Last Year',
    'All Time'
  ];

  contentString = 'This is a test. '.repeat(30);
  newsArticle = {
    newsImage: 'http://placehold.it/350x150',
    newsTitle: 'META SNAPSHOT #39',
    newsSubTitle: 'META SNAPSHOT #39',
    newsContent: this.contentString
  };
  newsData = Array(10).fill(this.newsArticle);

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    this.questionForm = new FormGroup({});
  }

  ngAfterContentInit() {
    this.categoryInput.initControl(
      this.questionForm,
      this.category,
      this.catFieldName,
      this.catControlName,
      this.categoryList
    );

    this.archiveInput.initControl(
      this.questionForm,
      this.archive,
      this.archiveFieldName,
      this.archiveControlName,
      this.archiveList
    );

    this.mapFormToModel();
  }

  private mapFormToModel() {
    this.categoryInput = this.questionForm.getRawValue();
    this.archiveInput = this.questionForm.getRawValue();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
