import { Component, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'ow-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['schedule.component.scss']
})

export class ScheduleComponent {
@ViewChild('esportsschedule') el;

  private lastScrollY;
  private currScrollY;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.listen('window' , 'scroll' , (event) => {this.onScroll(event);});
  }

  ngAfterViewInit(){
    this.lastScrollY = 0;
    this.currScrollY = 0;
  }

  onScroll(event) {
    if((this.currScrollY = window.scrollY) > this.lastScrollY){
      this.el.nativeElement.style.display = 'none';
    } else {
      this.el.nativeElement.style.display = 'flex';
    }
    this.lastScrollY = this.currScrollY;
    event.preventDefault();
  }

}
