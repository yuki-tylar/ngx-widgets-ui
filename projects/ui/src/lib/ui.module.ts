import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DirectiveModule } from '@takayuki-h/ngx-directive';
import { ButtonComponent } from './button/button.component';
import { IconModule } from '@takayuki-h/ngx-icons';
import { SwitchComponent } from './switch/switch.component';
import { SliderComponent } from './slider/slider.component';


@NgModule({
  declarations: [
    ButtonComponent, 
    SwitchComponent, 
    SliderComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    DirectiveModule,
    IconModule,
  ],
  exports: [
    ButtonComponent,
    SwitchComponent,
    SliderComponent,
  ]
})
export class UiModule { }
