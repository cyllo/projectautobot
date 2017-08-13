import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-news-page-header',
  templateUrl: 'news-page-header.component.html',
  styleUrls: ['news-page-header.component.scss']
})

export class NewsPageHeaderComponent implements OnInit {

  categories = ['All', 'Interview', 'Editorial', 'Patch Notes', 'New Releases', 'Sneak Peeks'];

  searchIsOpen = false;
  postsPerPage: number;
  currentCategory;

  constructor() {}

  ngOnInit() {}

  toggleSearch() {
    this.searchIsOpen = !this.searchIsOpen;
  }

}
