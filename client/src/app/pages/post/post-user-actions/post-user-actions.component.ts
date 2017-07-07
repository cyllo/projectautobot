import { Component , OnInit , HostListener } from '@angular/core';

@Component({
  selector: 'ow-post-user-actions',
  templateUrl: 'post-user-actions.component.html',
  styleUrls: [ 'post-user-actions.component.scss' ]
})
export class PostUserActionsComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

  @HostListener('window:scroll', ['$event'])
  onScroll( event ) {
    event.preventDefault();
  }

  @HostListener('window:resize', ['$event'])
  onResize( event ) {
    event.preventDefault();
  }

  @HostListener('window:DOMContentLoaded', ['$event'])
  onDOMLoaded() {
    event.preventDefault();
  }

}
