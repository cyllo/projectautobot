import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BlogPost } from '../../models';

@Component({
  selector: 'ow-news-post-card',
  templateUrl: 'news-post-card.component.html',
  styleUrls: ['news-post-card.component.scss']
})
export class NewsPostCardComponent implements OnInit {
  @Input('post') post: BlogPost;

  constructor(private router: Router) {}

  ngOnInit() {}

  loadPost() {
    this.router.navigate(['./post', this.post.title]);
  }

}
