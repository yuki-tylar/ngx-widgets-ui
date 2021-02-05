import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ButtonComponent } from './button/button.component';
import { IconModule } from '@takayuki-h/ngx-icons';


@NgModule({
  declarations: [ButtonComponent],
  imports: [
    CommonModule,
    IconModule
  ],
  exports: [ButtonComponent]
})
export class UiModule { }
