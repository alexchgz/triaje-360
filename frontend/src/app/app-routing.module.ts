import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { RecoveryComponent } from './auth/recovery/recovery.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';

const routes: Routes = [

  { path: 'login', component: AuthLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: '**', redirectTo: '' }
  ]},

  { path: 'recovery', component: AuthLayoutComponent,
    children: [
      { path: '', component: RecoveryComponent },
      { path: '**', redirectTo: '' }
  ]},

  { path: 'dashboard', component: AdminLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: '**', redirectTo: '' }
  ]},

  { path: '**', redirectTo: 'login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
