import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent  {

  constructor(private router: Router) { }

  doExercise(): boolean {
    let splitUrl = this.router.url.split("/");
    if(splitUrl[splitUrl.length-1] == 'do-exercise') {
      return true;
    }

    return false;
  }

}
