import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  public darkmode = 'disable';
  public color = 'default';
  public colors = ['default', 'blue', 'green', 'orange', 'yellow', 'grey-dark']

  get darkClass(){
    let c = '';
    switch(this.darkmode){
      case 'disable': c = ''; break;
      case 'auto': c = 'dark-auto'; break;
      case 'enable': c = 'dark'; break;
    }
    return c;
  }

  onClickButton(e:any){
  }

  changeDarkMode(state: string){
    this.darkmode = state;
  }

  changeColor(color: string){
    this.color = color; 
  }
}
