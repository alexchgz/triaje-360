import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';
// import {JwtHelperService} from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm;
  emailModel = 'admin@gmail.com';
  passwordModel = '';

  buttonDisabled = false;
  buttonState = '';

  constructor(private authService: AuthService, private notifications: NotificationsService, private router: Router) { }
  // private jwtHelper: JwtHelperService

  ngOnInit(): void {

    // if (!this.jwtHelper.isTokenExpired(localStorage.getItem('token'))) {
    //   // token expired
    //   this.router.navigate['/app/dashboards/all/subjects/data-list'];
    // }
  }

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
          this.notifications.create('Error', 'No se ha podido completar el inicio de sesión. Compruebe que el correo y la contraseña son correctos', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 8000,
            showProgressBar: false
          });
      });
    // }
  }

}
