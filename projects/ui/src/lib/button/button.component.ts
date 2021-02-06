import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { ColorPreset, DarkMode, State } from '../assets/types';

@Component({
  selector: 'ngx-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() type: 'button' | 'submit' = 'button';
  @Input() appearance: 'flat' | 'stripe' | 'default' = 'default';
  @Input() icon?: string;
  @Input() label?: string;
  @Input() round?: number | string;
  @Input() color: ColorPreset = 'green';
  @Input() darkmode: DarkMode = 'disable';
  @Input() state: State = 'off';

  @Output() click = new EventEmitter<PointerEvent | MouseEvent | TouchEvent>();

  private host: HTMLElement;
  private isTouch: boolean = false;
  constructor(_el: ElementRef) {this.host = _el.nativeElement; }

  get darkClass(){ return (this.darkmode == 'enable')? 'dark' : (this.darkmode=="auto")? 'dark-auto' : ''; }
  get colorClass(){ return this.color == 'default'? '' : this.color; }
  get activeClass(){ return this.state == 'on' ? 'active' : ''; }

  get bgClass(){
    let c = '';
    switch(this.appearance){
      case 'flat': break;
      default: c = 'color-bg';
    }
    return c;
  }

  get borderClass(){
    let c = '';
    switch(this.appearance){
      case 'flat': break;
      default: c = 'color-border active';
    }
    return c;
  }

  get textClass(){
    let c = '';
    switch(this.appearance){
      case 'flat': break;
      default: c = 'color-text accent'
    }
    return c;
  }

  get appearanceClass(){
    let c = '';
    switch(this.appearance){
      case 'flat': break;
      default:
        c = 'color-text color-bg color-border';
        if(this.state == 'on'){ c += ' active'; }
    }
    return c;
  }
  get paddingClass(){
    let c ='';
    if(this.icon && (!this.label || this.label.length == 0)){ c = 'icon-only'}
    return c;
  }
  get roundClass(){
    let c = '';
    if(this.round !== undefined){
      c = 'rounded';
      if(typeof this.round == 'string' && this.round.match(/^(pill)$/)){ c += '-' + this.round; }
      else if(!isNaN(Number(this.round)) && Number(this.round) > 0 ){ c += '-' + this.round.toString(); }
    }
    return c;
  }

  @HostListener('mousedown') Mousedown(){ this.onTouchStart(); }
  @HostListener('touchstart') Touchstart(){ this.onTouchStart(); }
  @HostListener('window:mouseup') WindowMousedown(){ this.onTouchEnd(); }
  @HostListener('window:touchend') WindowTouchend(){ this.onTouchEnd(); }


  ngOnChanges(){

  }
  ngOnInit(): void {
  }

  onTouchStart(){
    const target = this.host.querySelector('button') as HTMLButtonElement;
    target.style.transform = 'scale(0.98)';
    this.isTouch = true;
  }
  
  onTouchEnd(){
    if(this.isTouch){
      const target = this.host.querySelector('button') as HTMLButtonElement;
      target.style.transform = 'scale(1)';
      this.isTouch = false;
    }
  }

  onClick(e: PointerEvent | MouseEvent | TouchEvent){
    e.stopPropagation();
    this.state = (this.state == 'on') ? 'off' : 'on';
    this.click.emit(e);
  }
}
