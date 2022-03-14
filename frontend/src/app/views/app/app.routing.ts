import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BlankPageComponent } from './blank-page/blank-page.component';
import { UserRole } from '../../shared/auth.roles';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'subjects' },
      {
        path: 'dashboards',
        loadChildren: () =>
          import('./dashboards/dashboards.module').then(
            (m) => m.DashboardsModule
          ),
          data: { roles: [UserRole.Admin, UserRole.Teacher, UserRole.Student] },
      },
      {
        path: 'school-years',
        loadChildren: () =>
          import('./school-years/school-years.module').then((m) => m.SchoolYearsModule),
          data: { roles: [UserRole.Admin] },
      },
      {
        path: 'subjects',
        loadChildren: () =>
          import('./subjects/subjects.module').then((m) => m.SubjectsModule),
          data: { roles: [UserRole.Admin, UserRole.Teacher, UserRole.Student] },
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
          data: { roles: [UserRole.Admin] },
      },
      {
        path: 'exercises',
        loadChildren: () =>
          import('./exercises/exercises.module').then((m) => m.ExercisesModule),
          data: { roles: [UserRole.Admin, UserRole.Teacher, UserRole.Student] },
      },
      {
        path: 'menu',
        loadChildren: () =>
          import('./menu/menu.module').then((m) => m.MenuModule),
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
