import { Component, OnInit, Input } from '@angular/core';
import { BlogPost } from '../../../models';

@Component({
  selector: 'ow-post-entry',
  templateUrl: 'post-entry.component.html',
  styleUrls: [ 'post-entry.component.scss' ]
})
export class PostEntryComponent implements OnInit {
  @Input() post: BlogPost;

  constructor() {}

  ngOnInit() {}

}
