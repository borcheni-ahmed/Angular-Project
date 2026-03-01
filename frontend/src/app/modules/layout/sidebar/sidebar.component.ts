import { Component } from '@angular/core';
import {AuthService} from "../../../core/services/auth.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  isuser = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isuser = this.authService.isCustomer();
  }
}
