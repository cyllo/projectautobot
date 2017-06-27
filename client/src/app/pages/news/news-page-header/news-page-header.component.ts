import { Component , OnInit, AfterContentInit , ViewChild } from '@angular/core';

@Component({
  selector: 'ow-news-page-header',
  templateUrl: 'news-page-header.component.html',
  styleUrls: ['news-page-header.component.scss']
})

export class NewsPageHeaderComponent implements OnInit, AfterContentInit {
  @ViewChild('newspageheader') elNewsPageHeader;

  private elMainNav;
  private elPageHeader;
  private elNewsBody;

  constructor() {}

  ngOnInit() {}

  ngAfterContentInit() {
    this.elNewsBody   = document.getElementById('news-body');
    this.elMainNav    = document.getElementById('main-nav');
    this.elPageHeader = this.elNewsPageHeader.nativeElement;
    // this.renderer.listen('window' , 'scroll'          , (event) => { this.onScroll(event); });
    // this.renderer.listen('window' , 'resize'          , (event) => { this.onResize(event);    });
    // this.renderer.listen('window' , 'DOMContentLoaded', (event) => { this.onDOMLoaded(event); });
    this.updateHeaderOffset();
    this.updateNewsBodyOffset();
  }

  onScroll(event) {
    // this.updateHeaderOffset();
    event.preventDefault();
  }

  onResize(event) {
    this.updateNewsBodyOffset();
    event.preventDefault();
  }

  onDOMLoaded(event) {
    this.updateHeaderOffset();
    this.updateNewsBodyOffset();
    event.preventDefault();
  }

  updateHeaderOffset() {
    if ( this.elPageHeader && this.elMainNav ) {
      this.elPageHeader.style.top = this.elMainNav.offsetHeight + 'px';
    }
  }

  updateNewsBodyOffset() {
    if ( this.elNewsBody && this.elPageHeader ) {
      this.elNewsBody.style.marginTop = this.elPageHeader.offsetHeight + 'px';
    }
  }

}
