import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { compose, objOf, evolve, map, prop } from 'ramda';

import { BlogPost, BlogCategories } from '../../../models';

const serializeBlogCategory = compose(objOf('name'), prop('value'));
const serializeblogPost = evolve({ blogCategories: map(serializeBlogCategory) });

@Component({
  selector: 'ow-create-post-form',
  templateUrl: 'form.component.html',
  styleUrls: ['form.component.scss']
})
export class CreatePostFormComponent implements OnInit {
  @Output() postSubmit = new EventEmitter<BlogPost>();
  @Input() blogCategories: BlogCategories[];

  postForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      blogCategories: ['', Validators.required],
      thumbnailUrl: ['', Validators.required],
      heroImageUrl: ['', Validators.required],
      summary: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  onSubmit(formInfo) {
    console.log('Serialize: ');
    this.postSubmit.next(serializeblogPost(formInfo));
  }
}
