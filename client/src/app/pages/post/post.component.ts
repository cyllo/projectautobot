import { Component , OnInit , HostListener } from '@angular/core';

@Component({
  selector: 'ow-post',
  templateUrl: 'post.component.html',
  styleUrls: [ 'post.component.scss' ]
})

export class PostComponent implements OnInit {

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
  onDOMLoaded( event ) {
    event.preventDefault();
  }

}
