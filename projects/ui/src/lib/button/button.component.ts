import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { State } from '../assets/types';

@Component({
  selector: 'ngx-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() type: 'button' | 'submit' = 'button';
  @Input() appearance: string = 'rounded-5'; /**flat | pill | rounded-{{number}} | default | rect */
  @Input() darkmode: string = 'disable';
  @Input() color: string = 'default';
  @Input() round?: number | string;
  @Input() icon?: string;
  @Input() label?: string;
  @Input() state: State = 'off';
  @Input() stateful: boolean = true;

  @Output() click = new EventEmitter<PointerEvent | MouseEvent | TouchEvent>();

  get darkClass(){ return (this.darkmode == 'enable')? 'ngx-dark' : (this.darkmode=="auto")? 'ngx-dark-auto' : ''; }
  get colorClass(){ return this.color == 'default'? '' : this.color; }
  get pushClass(){ return (this.isTouch) ? 'pushing' : ''; }
  get stateClass(){ return (this.state == 'on' && this.stateful) ? 'active' : ''; }

  get borderClass(){
    let c = [];
    switch(this.appearance){
      case 'default':
      case 'rect': break;
      case 'pill': c.push('rounded-pill'); break;
      case 'flat': c.push('border-none'); break;
      default: c.push(this.appearance);
    }
    return c.join(' ');
  }

  get paddingClass(){
    let c ='';
    if(this.icon && (!this.label || this.label.length == 0)){ c = 'icon-only'}
    return c;
  }


  private isTouch: boolean = false;
  constructor() {}

  @HostListener('mousedown') Mousedown(){ this.onTouchStart(); }
  @HostListener('touchstart') Touchstart(){ this.onTouchStart(); }
  @HostListener('window:mouseup') WindowMousedown(){ this.onTouchEnd(); }
  @HostListener('window:touchend') WindowTouchend(){ this.onTouchEnd(); }

  ngOnInit(): void {
  }

  onTouchStart(){ this.isTouch = true; }
  onTouchEnd(){ if(this.isTouch){ this.isTouch = false; } }

  onClick(e: PointerEvent | MouseEvent | TouchEvent){
    e.stopPropagation();
    this.state = (this.state == 'on') ? 'off' : 'on';
    this.click.emit(e);
  }
}
