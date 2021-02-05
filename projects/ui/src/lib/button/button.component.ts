import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, } from '@angular/core';
import { ColorPreset, DarkMode, State } from '../assets/types';

@Component({
  selector: 'ngx-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() type: 'button' | 'submit' = 'button';
  @Input() appearance: 'flat' | 'default' = 'flat';
  @Input() icon?: string = 'lock';
  @Input() label?: string;
  @Input() round?: number | string;
  @Input() color: ColorPreset = 'default';
  @Input() darkmode: DarkMode = 'disable';
  @Input() state: State = 'off';

  @Output() click = new EventEmitter<PointerEvent | MouseEvent | TouchEvent>();

  constructor() { }

  get darkClass(){ return (this.darkmode == 'enable')? 'dark' : (this.darkmode=="auto")? 'dark-auto' : ''; }
  get colorClass(){ return this.color == 'default'? '' : this.color; }
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

  ngOnChanges(e: SimpleChanges){

  }
  ngOnInit(): void {
  }

  onClick(e: PointerEvent | MouseEvent | TouchEvent){
    e.stopPropagation();
    this.state = (this.state == 'on') ? 'off' : 'on';
    this.click.emit(e);
  }
}
