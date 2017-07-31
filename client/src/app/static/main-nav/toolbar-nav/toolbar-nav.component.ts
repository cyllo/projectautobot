import { Component,
         Output,
         Input,
         EventEmitter,
         HostListener,
         ElementRef,
         ViewChildren,
         QueryList } from '@angular/core';
import { NavLink } from '../../../models';

@Component({
  selector: 'ow-toolbar-nav',
  templateUrl: 'toolbar-nav.component.html',
  styleUrls: ['toolbar-nav.component.scss']
})

export class ToolbarNavComponent {
  @Output() hide: EventEmitter<any> = new EventEmitter<any>();
  @ViewChildren('navListItem', { read: ElementRef }) navListItems: QueryList<ElementRef>;
  @Input('navlinks')
   set navLinks(value: NavLink[]) {
     this._ignoreFirstClickOut = true;
     this._navLinks = value;
   }
   get navLinks() {
     return this._navLinks;
   }

  private _navLinks: NavLink[];
  private _ignoreFirstClickOut: boolean;

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClickOut($event: any) {
    if (!this._ignoreFirstClickOut &&
        !this.el.nativeElement.contains($event.target) ||
        this.navListItemClicked($event)
      ) {
      this.hide.emit();
    }
    this._ignoreFirstClickOut = false;
  }

  navListItemClicked($event: any): boolean {
    return !this.navListItems.toArray().every((e: ElementRef) => {
      return !e.nativeElement.contains($event.target);
    });
  }

}
