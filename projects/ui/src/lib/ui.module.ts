import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ButtonComponent } from './button/button.component';
import { IconModule } from '@takayuki-h/ngx-icons';
import { SwitchComponent } from './switch/switch.component';


@NgModule({
  declarations: [
    ButtonComponent, 
    SwitchComponent
  ],
  imports: [
    CommonModule,
    IconModule
  ],
  exports: [
    ButtonComponent,
    SwitchComponent
  ]
})
export class UiModule { }
