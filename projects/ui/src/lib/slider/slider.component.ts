import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { UiItemComponent } from '../ui.service';
import { animate, trigger, state, style, transition } from '@angular/animations';
import { DragEvent } from '@takayuki-h/ngx-directive';

const fade = trigger('fade', [
  transition(':enter', [
    style({display: 'block', opacity: 0}),
    animate("200ms ease", style({opacity: 1}))
  ]),
  transition(':leave', [
    animate("200ms ease", style({opacity: 0}))
  ])
])
@Component({
  selector: 'ngx-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  animations: [fade]
})
export class SliderComponent implements OnInit, UiItemComponent {

  @Input() color: string = 'default';
  @Input() darkmode: string = 'disable';

  @Input() min: number | string = 39;
  @Input() max: number | String = 230;
  @Input() interval: number | string = 8;
  @Input() multiple: boolean | string = true;

  @Output() change= new EventEmitter<ValueChangeEvent>();

  get colorClass(){ return this.color !== 'default' ? this.color : ''; }
  get darkClass(){ return (this.darkmode == 'enable')? 'ngx-dark' : (this.darkmode=="auto")? 'ngx-dark-auto' : ''; }

  get grabbingClass(){ return (this.isDragging)? 'grabbing' : ''; }
  get buttonClass(){ return (this.isDragging) ? 'grabbing' : 'animate-left'; }


  get minVal(){ return Number(this.min); }
  get maxVal(){ return Number(this.max); }
  get intervalVal(){ return Number(this.interval); }
  get ratioPerStep(){ return  Math.round(10000 * this.intervalVal / (this.maxVal - this.minVal)) / 100; }
  get isMultiple(){ return (this.multiple === false || this.multiple === 'false') ? false: true; }

  public stepper: StepperItem[] = [];
  public target: StepperItem | null = null;
  public targetIdxButton: number = -1;
  public isDragging: boolean = false;
  
  private coords0!: number[]; /** previous x coord list for slide button */
  public  coords!:  number[]; /** current coord list for slide button*/
  private values!: number[];
 
  private host: HTMLElement;
  private wRail!: number;
  private timer: any;

  constructor(
    _el: ElementRef,
    private changeDetector: ChangeDetectorRef,
    ) { this.host = _el.nativeElement; }

  ngOnInit(): void {
    this.coords = [0, 100];
    this.coords0 =[0, 100];
    this.values = [this.minVal, this.maxVal];

    let i: number = 0;
    let coord: number = 0;
    while(coord <= 100){
      this.stepper.push({coord: coord, label: this.minVal + this.intervalVal * i, index: i});
      i++;
      coord = Math.round(i * this.ratioPerStep * 100) / 100;
    }
    this.stepper.push({coord: 100, label: this.maxVal, index: this.stepper.length});
  }

  onClickRail(e: MouseEvent){
    const rail = this.host.querySelector('.ngx-slider-rail') as HTMLDivElement;
    if(rail.isSameNode(e.target as HTMLElement)){ 
      const rect = rail.getBoundingClientRect();
      const coord = Math.round((e.x - rect.left) / rect.width * 10000) / 100;
      const step = this.getStepClosest(coord);
      if(step){
        if(this.targetIdxButton == -1){
          this.targetIdxButton = (Math.abs(step.coord - this.coords[0]) < (Math.abs(step.coord - this.coords[1])) ) ? 0 : 1;      
        }

        /** restriction not to go beyond each other (if beyond, action is cancelled) */
        if(
          (this.targetIdxButton == 0 && step.coord < this.coords[1]) ||
          (this.targetIdxButton == 1 && step.coord > this.coords[0])
        ){
          this.setTarget(step);
          this.setChange(this.targetIdxButton, step);
        }
      }
      this.clearTarget(false);
    }    
  }

  onDragStart(i: number){
    this.targetIdxButton = i;
    this.isDragging = true;
    this.wRail = (this.host.querySelector('.ngx-slider-rail') as HTMLDivElement).clientWidth;
    this.coords.forEach((v,i)=> { this.coords0[i] = v; })
  }

  onDrag(i: number, e: DragEvent){
    const coord = this.getCurrentCoord(i, e.dxAll);

    /** restriction not to go beyond each slider */
    if(
      (i == 0 && coord <= this.coords[1]) ||
      (i == 1 && coord >= this.coords[0])
    ){
      this.coords[i] = coord;
    }

    const stepNext = this.getStepClosest(this.coords[i]);
    this.setTarget(stepNext);
  }

  onDragEnd(i: number, e: DragEvent){
    this.isDragging = false;
    let stepNext = this.getStepClosest(this.coords[i]);
    if(stepNext){

      /** restriction not to have same value each other */
      if(stepNext.label == this.values[(i+1)%2]){
        stepNext = this.stepper[ ((i == 0)? stepNext.index - 1 : stepNext.index + 1) ];
      }

      this.setTarget(stepNext);
      this.setChange(i, stepNext);
    }
    this.clearTarget(false);
  }

  getCurrentCoord(i: number, delta: number){
    const coord = this.coords0[i] + Math.round(delta / this.wRail * 10000) / 100;
    return (coord < 0) ? 0 : (coord > 100) ? 100 : coord;
  }

  getStepClosest(coord: number): StepperItem | null{
    let stepNext: StepperItem | null = null;
    if(coord <= 0){ stepNext = this.stepper[0]; }
    else if(coord >= 100){ stepNext = this.stepper[this.stepper.length - 1]; }
    else{
      for(let i=0; i<this.stepper.length; i++){
        if(this.stepper[i].coord <= coord && coord <= this.stepper[i+1].coord){
          stepNext = (coord - this.stepper[i].coord < this.stepper[i+1].coord - coord)? this.stepper[i] : this.stepper[i+1];
          break;
        }
      }
    }
    return stepNext;
  }

  setTarget(target: StepperItem | null = null){
    if(this.timer){ clearTimeout(this.timer); }
    this.target = target;
  }

  clearTarget(immediately: boolean = true){
    if(this.timer){ clearTimeout(this.timer); }
    this.timer = setTimeout(()=>{ 
      this.setTarget();
      this.targetIdxButton = -1;
      this.changeDetector.markForCheck();
    }, immediately? 0 : 2500);
  }

  setChange(i: number, step: StepperItem){
    const isEmit = (this.values[i] != step.label);

    this.coords[i] = step.coord; 
    this.values[i] = step.label;

    if(isEmit){
      if(this.isMultiple){ this.change.emit({values: this.values}); }
      else{ this.change.emit({value: this.values[0]}); }  
    }    
  }
}

interface StepperItem{
  index: number;
  label: number;
  coord: number;
}

interface ValueChangeEvent{
  values?: number[];
  value?: number;
}