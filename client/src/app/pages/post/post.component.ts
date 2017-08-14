import { Component , OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogPost } from '../../models';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ow-post',
  templateUrl: 'post.component.html',
  styleUrls: [ 'post.component.scss' ]
})

export class PostComponent implements OnInit {

  blogPosts: Observable<BlogPost[]>;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.blogPosts = Observable.of([data.blogPost]);
    });
  }

}
