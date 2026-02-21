import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  role = this.authService.getRole();

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
