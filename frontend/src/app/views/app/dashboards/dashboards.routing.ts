import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardsComponent } from './dashboards.component';
import { DefaultComponent } from './default/default.component';
import { ContentComponent } from './content/content.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { EcommerceComponent } from './ecommerce/ecommerce.component';
import { PruebaComponent } from './prueba/prueba.component';
import { UserRole } from 'src/app/shared/auth.roles';
import { AllComponent } from './all/all.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardsComponent,
    children: [
      { path: '', redirectTo: 'all', pathMatch: 'full' },
      {
        path: 'default',
        component: DefaultComponent,
        // data: { roles: [UserRole.Admin] },
      },
      {
        path: 'content',
        component: ContentComponent,
        // data: { roles: [UserRole.Admin] },
      },
      {
        path: 'analytics',
        component: AnalyticsComponent,
        // data: { roles: [UserRole.Admin, UserRole.Editor] },
      },
      {
        path: 'ecommerce',
        component: EcommerceComponent,
        // data: { roles: [UserRole.Editor] },
      },
      {
        path: 'all',
        component: AllComponent,
        // data: { roles: [UserRole.Editor] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardsRoutingModule {}
