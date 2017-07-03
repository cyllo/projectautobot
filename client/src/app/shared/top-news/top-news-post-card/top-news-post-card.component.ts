import { Component , Input } from '@angular/core';

@Component({
  selector: 'ow-top-news-post-card',
  templateUrl: 'top-news-post-card.component.html',
  styleUrls: ['top-news-post-card.component.scss']
})
export class TopNewsPostCardComponent {
  @Input() featuredPost: boolean;

  constructor() {}

}
