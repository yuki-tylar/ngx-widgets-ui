import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { UiItemComponent } from '../ui.service';

@Component({
  selector: 'ngx-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit, UiItemComponent {

  @Input() darkmode: string = 'disable';
  @Input() color: string = 'orange'

  @Input() state: string = 'off';

  @Output() click = new EventEmitter<PointerEvent | MouseEvent | TouchEvent>();

  get darkClass(){ return (this.darkmode == 'enable')? 'ngx-dark' : (this.darkmode=="auto")? 'ngx-dark-auto' : ''; }
  get colorClass(){ return (this.color == 'default') ? '' : this.color; }
  get stateClass(){ return (this.state == 'on') ? 'active' : ''; }
  get pushClass(){ return (this.isTouch) ? 'pushing' : ''; }

  private isTouch: boolean = false;

  constructor(){}

  @HostListener('mousedown') Mousedown(){ this.onTouchStart(); }
  @HostListener('touchstart') Touchstart(){ this.onTouchStart(); }
  @HostListener('window:mouseup') WindowMousedown(){ this.onTouchEnd(); }
  @HostListener('window:touchend') WindowTouchend(){ this.onTouchEnd(); }

  ngOnInit(){}

  onTouchStart(){ this.isTouch = true; }
  onTouchEnd(){ if(this.isTouch){ this.isTouch = false; } }

  onClick(e: PointerEvent | MouseEvent | TouchEvent){
    e.stopPropagation();
    this.state = (this.state == 'on')? 'off' : 'on';
    this.click.emit(e);
  }
}
