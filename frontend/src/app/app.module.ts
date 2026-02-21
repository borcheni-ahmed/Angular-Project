import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './modules/layout/navbar/navbar.component';
import { SidebarComponent } from './modules/layout/sidebar/sidebar.component';
import { MainLayoutComponent } from './modules/layout/main-layout/main-layout.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { CustomerListComponent } from './modules/customers/customer-list/customer-list.component';
import { CustomerFormComponent } from './modules/customers/customer-form/customer-form.component';
import { ToastComponent } from './core/components/toast/toast.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    SidebarComponent,
    MainLayoutComponent,
    DashboardComponent,
    CustomerListComponent,
    CustomerFormComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,  // ← allows HTTP calls to the API
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }  // ← attaches JWT to every request
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }




// in declarations:


