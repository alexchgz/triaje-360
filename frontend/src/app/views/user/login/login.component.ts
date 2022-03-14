import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm;
  emailModel = 'default@gmail.com';
  passwordModel = '';

  buttonDisabled = false;
  buttonState = '';

  constructor(private authService: AuthService, private notifications: NotificationsService, private router: Router) { }

  ngOnInit(): void { }

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
      return;
    } //si es valido

    this.authService.login(this.loginForm.value).subscribe(res =>{
      this.router.navigate([environment.adminRoot]);
    },(error) => {
      this.buttonDisabled = false;
      this.buttonState = '';
      this.notifications.create('Error', 'No se ha podido completar el inicio de sesión. Compruebe que el correo y la contraseña son correctos', NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 8000,
        showProgressBar: false
      });
    });
  }

}
