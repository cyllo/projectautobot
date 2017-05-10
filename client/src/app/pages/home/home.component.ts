import { Component, ViewChild, OnInit, AfterContentInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ow-home',
  templateUrl: 'home.component.html',
  styleUrls: [ 'home.component.scss' ]
})

export class HomeComponent implements OnInit, AfterContentInit {
  @ViewChild('search') searchInput;

  private search;
  public searchName = '';
  public searchControl = 'search';
  public searchPlaceholder = 'Search for a Hero';

  questionForm: FormGroup;

  constructor() {}

  ngOnInit() {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    this.questionForm = new FormGroup({});
  }

  ngAfterContentInit() {
    // Called after ngOnInit when the component's or directive's content has been initialized.
    // Add 'implements AfterContentInit' to the class.
    this.searchInput.initControl(this.questionForm, this.search, this.searchName, this.searchControl, this.searchPlaceholder, false);
    this.mapFormToModel();
  }

  private mapFormToModel() {
    this.searchInput = this.questionForm.getRawValue();
  }

}
