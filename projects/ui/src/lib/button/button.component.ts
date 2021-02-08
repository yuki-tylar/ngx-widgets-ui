import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { State } from '../assets/types';

@Component({
  selector: 'ngx-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() type: 'button' | 'submit' = 'button';
  @Input() appearance: string = 'default'; /**flat | pill | rounded-{{number}} | default | rect */
  @Input() darkmode: string = 'disable';
  @Input() color: string = 'default';
  @Input() icon?: string;
  @Input() label?: string;
  @Input() state: State = 'off';
  @Input() stateChangeStyle = 'invert'; /** stateless | invert | default */

  @Output() click = new EventEmitter<PointerEvent | MouseEvent | TouchEvent>();

  get containerClass(){
    const c = [];
    if(this.darkmode == 'enable'){ c.push('ngx-dark'); }else if(this.darkmode == 'auto'){ c.push('ngx-dark-auto'); }
    if(this.stateChangeStyle !== 'stateless'){ c.push('state-change-' + this.stateChangeStyle); }
    c.push('appearance-' + this.appearance);
    return c.join(' ');
  }

  get pushClass(){  return (this.isTouch) ? 'pushing' : ''; }
  get stateClass(){ return (this.state == 'on' && this.stateChangeStyle !== 'stateless') ? 'on' : 'off'; }

  get paddingClass(){
    let c ='';
    if(this.icon && (!this.label || this.label.length == 0)){ c = 'icon-only'}
    return c;
  }

  get colorClass(){ return this.color !== 'default' ? this.color : ''; }

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
