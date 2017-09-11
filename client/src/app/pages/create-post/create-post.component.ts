import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { pluck } from 'ramda';

import { BlogPost, BlogCategories } from '../../models';
import { BlogPostsService } from '../../services/blog-posts.service';

@Component({
  selector: 'ow-create-post',
  templateUrl: 'create-post.component.html',
  styleUrls: ['create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  blogCategories$: Observable<string[]>;

  constructor(private router: Router, private blogPostService: BlogPostsService) { }

  ngOnInit() {
    this.blogCategories$ = this.blogPostService.getCategories()
      .map<BlogCategories[], string[]>(pluck('name'));
  }

  onPostSubmit(post: BlogPost) {
    this.blogPostService.createPost(post)
      .subscribe(({ title }: BlogPost) => this.router.navigate(['post', title]));
  }
}
