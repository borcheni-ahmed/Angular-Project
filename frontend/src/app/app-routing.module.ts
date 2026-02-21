import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { MainLayoutComponent } from './modules/layout/main-layout/main-layout.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { CustomerListComponent } from './modules/customers/customer-list/customer-list.component';
import { CustomerFormComponent } from './modules/customers/customer-form/customer-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'customers', component: CustomerListComponent, canActivate: [AuthGuard] },
      { path: 'customers/create', component: CustomerFormComponent, canActivate: [AuthGuard, AdminGuard] },
      { path: 'customers/edit/:id', component: CustomerFormComponent, canActivate: [AuthGuard, AdminGuard] }
    ]
  },
  { path: '**', redirectTo: 'login' }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



