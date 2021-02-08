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
  public appearance = 'default';
  public appearances = ['default', 'flat', 'pill', 'rounded-10', 'rounded-5', 'rounded'];
  public stateChangeStyle = 'default';
  public stateChangeStyles = ['default', 'invert', 'stateless'];

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

  changeDarkMode(state: string){ this.darkmode = state; }
  changeColor(color: string){ this.color = color; }
  changeAppearance(appearance: string){ this.appearance = appearance; }
  changeStateStyles(style: string){ this.stateChangeStyle = style; }
}
