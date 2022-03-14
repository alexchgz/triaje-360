import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { environment } from 'src/environments/environment';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../shared/auth.guard';
import { UserRole } from '../shared/auth.roles';
import { NoauthGuard } from '../shared/noauth.guard';

const adminRoot = environment.adminRoot.substr(1); // path cannot start with a slash

let routes: Routes = [
  {
    path: '',
    redirectTo: '/user/login',
    pathMatch: 'full',
  },
  {
    path: adminRoot,
    loadChildren: () => import('./app/app.module').then((m) => m.AppModule),
    data: { roles: [UserRole.Admin, UserRole.Teacher, UserRole.Student] },
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
    data: { roles: [UserRole.Admin, UserRole.Teacher, UserRole.Student] },
    canActivate: [NoauthGuard],
    canActivateChild: [NoauthGuard],
  },
  {
    path: 'users',
    loadChildren: () => import('./app/users/users.module').then((m) => m.UsersModule),
    data: { roles: [UserRole.Admin] },
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'school-years',
    loadChildren: () => import('./app/school-years/school-years.module').then((m) => m.SchoolYearsModule),
    data: { roles: [UserRole.Admin] },
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'subjects',
    loadChildren: () => import('./app/subjects/subjects.module').then((m) => m.SubjectsModule),
    data: { roles: [UserRole.Admin, UserRole.Teacher, UserRole.Student] },
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'exercises',
    loadChildren: () => import('./app/exercises/exercises.module').then((m) => m.ExercisesModule),
    data: { roles: [UserRole.Admin, UserRole.Teacher, UserRole.Student] },
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  { path: 'error', component: ErrorComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: '/error' },
];

if (!environment.isAuthGuardActive) {
  routes = [
    {
      path: '',
      component: HomeComponent,
      pathMatch: 'full',
    },
    {
      path: 'app',
      loadChildren: () => import('./app/app.module').then((m) => m.AppModule),
    },
    {
      path: 'user',
      loadChildren: () =>
        import('./user/user.module').then((m) => m.UserModule),
    },
    {
      path: 'users',
      loadChildren: () => import('./app/users/users.module').then((m) => m.UsersModule),
    },
    {
      path: 'school-years',
      loadChildren: () => import('./app/school-years/school-years.module').then((m) => m.SchoolYearsModule),
    },
    {
      path: 'subjects',
      loadChildren: () => import('./app/subjects/subjects.module').then((m) => m.SubjectsModule),
    },
    {
      path: 'exercises',
      loadChildren: () => import('./app/exercises/exercises.module').then((m) => m.ExercisesModule),
    },
    { path: 'error', component: ErrorComponent },
    { path: '**', redirectTo: '/error' },
  ];
}
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewRoutingModule {}
