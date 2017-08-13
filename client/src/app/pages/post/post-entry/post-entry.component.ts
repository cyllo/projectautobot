import { Component,
         OnInit,
         Input,
         Output,
         ElementRef,
         Inject,
         HostListener,
         EventEmitter } from '@angular/core';
import { BlogPost } from '../../../models';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'ow-post-entry',
  templateUrl: 'post-entry.component.html',
  styleUrls: [ 'post-entry.component.scss' ]
})
export class PostEntryComponent implements OnInit {
  @Input() post: BlogPost;
  @Output() progress: EventEmitter<number> = new EventEmitter<number>();
  @Output() next: EventEmitter<number> = new EventEmitter<number>();
  @Output() previous: EventEmitter<number> = new EventEmitter<number>();

  constructor(@Inject(DOCUMENT) private document: Document, private el: ElementRef) {}

  ngOnInit() {}

  @HostListener('window:scroll', [])
  onScroll() {

    const rect = this.el.nativeElement.getBoundingClientRect();
    const height: number = rect.bottom - rect.top;
    const tolerance = 0.1; // margin of error

    if (this.elVisible(rect)) {

      const scrollTop = this.document.body.scrollTop;
      const scrollBottom = scrollTop + this.document.body.offsetHeight;

      const amountOfPostScrolled = ( scrollBottom / ( rect.bottom + height ) + tolerance );

      if ( scrollTop <= rect.top ) {
        this.previous.emit();
      }

      if ( amountOfPostScrolled >= 0.75 ) {
        this.next.emit(this.post.id);
      }

      this.progress.emit(Math.round(Math.min(amountOfPostScrolled, 1)  * 100));

    }

  }

  elVisible(rect): boolean {
    return rect.top   < (window.pageYOffset + window.innerHeight) &&
           rect.left  < (window.pageXOffset + window.innerWidth) &&
           (rect.top  + (rect.bottom - rect.top)) > window.pageYOffset &&
           (rect.left + (rect.right - rect.left)) > window.pageXOffset;
  }

}
