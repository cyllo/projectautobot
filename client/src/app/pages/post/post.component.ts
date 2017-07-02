import { Component , OnInit , ViewEncapsulation , HostListener } from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'ow-post',
  templateUrl: 'post.component.html',
  styleUrls: [ 'post.component.scss' ]
})

export class PostComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

  @HostListener('window.scroll')
  onScroll( event ) {
    event.preventDefault();
  }

  @HostListener('window.resize')
  onResize( event ) {
    event.preventDefault();
  }

  @HostListener('window.DOMContentLoaded')
  onDOMLoaded( event ) {
    event.preventDefault();
  }

}
