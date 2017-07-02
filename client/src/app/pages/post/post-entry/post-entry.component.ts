import { Component , OnInit , HostListener , ViewChild } from '@angular/core';

@Component({
  selector: 'ow-post-entry',
  templateUrl: 'post-entry.component.html',
  styleUrls: [ 'post-entry.component.scss' ]
})
export class PostEntryComponent implements OnInit {
  @ViewChild('postentry') _elPost;
  @ViewChild('postheader') _elPostHeader;

  constructor() {}

  ngOnInit() {}

  @HostListener('window:scroll', ['$event'])
  onScroll( event ): void {
    event.preventDefault();
  }

  @HostListener('window:resize', ['$event'])
  onResize( event ): void {
    console.log('Window Resized');
    event.preventDefault();
  }

  @HostListener('window:DOMContentLoaded', ['$event'])
  onDOMLoaded( event ): void {
    console.log('DOMContentLoaded');
    event.preventDefault();
  }


}
