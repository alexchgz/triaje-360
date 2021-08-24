import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm: NgForm;
  emailModel = 'demo@vien.com';
  passwordModel = 'demovien1122';

  buttonDisabled = false;
  buttonState = '';

  constructor(private authService: AuthService, private notifications: NotificationsService, private router: Router) { }


  onSubmit(): void {
    if (this.loginForm.valid) {
      if (this.buttonDisabled) {

        this.buttonDisabled = true;
        this.buttonState = 'show-spinner';
        this.authService.signIn(this.loginForm.value).then(() => {
          this.router.navigate([environment.adminRoot]);
        }).catch((error) => {
          this.buttonDisabled = false;
          this.buttonState = '';
          this.notifications.create('Error', error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });
        });
      }
    }
  }

  login() {

    if(!this.loginForm.valid){
      //console.log('errores en el formulario');
      return;
    } //si es valido

    // if (this.buttonDisabled) {
    //   this.buttonDisabled = true;
    //   this.buttonState = 'show-spinner';
      this.authService.login(this.loginForm.value).subscribe(res =>{
          this.router.navigate([environment.adminRoot]);
        },(error) => {
          //mostrar mensaje de error en pantalla con sweetalert2
          console.log('No se ha podido hacer login');
          this.buttonDisabled = false;
          this.buttonState = '';
          this.notifications.create('Error', error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });
      });
    // }
  }
  // if (this.loginForm.valid) {
  //   if (this.buttonDisabled) {

  //     this.buttonDisabled = true;
  //     this.buttonState = 'show-spinner';
  //     this.authService.signIn(this.loginForm.value).then(() => {
  //       this.router.navigate([environment.adminRoot]);
  //     }).catch((error) => {
  //       this.buttonDisabled = false;
  //       this.buttonState = '';
  //       this.notifications.create('Error', error.message, NotificationType.Bare, {
  //         theClass: 'outline primary',
  //         timeOut: 6000,
  //         showProgressBar: false
  //       });
  //     });
  //   }
  // }

}
