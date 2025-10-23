import { Component, OnInit, inject } from '@angular/core';
import { MenuCooroomsComponent } from './menu-coorooms/menu-coorooms.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MenuAsacadComponent } from './menu-asacad/menu-asacad.component';
import { MenuAdminComponent } from './menu-admin/menu-admin.component';

@Component({
  selector: 'app-menu',
  imports: [
    MenuCooroomsComponent,
    CommonModule,
    MenuAsacadComponent,
    MenuAdminComponent,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  private authService = inject(AuthService);

  showAsacadMenu = false;
  showCooroomsMenu = false;
  showAdminMenu = false;

  ngOnInit() {
    this.checkUserRole();
  }

  checkUserRole() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.showAsacadMenu = this.authService.hasRole('ASACAD');
      this.showCooroomsMenu = this.authService.hasRole('COOROOMS');
      this.showAdminMenu = this.authService.hasRole('ADMIN');
      // If no valid role, redirect to home or show error
      if (
        !this.showAsacadMenu &&
        !this.showCooroomsMenu &&
        !this.showAdminMenu
      ) {
        console.warn('User does not have a valid role for menu access');
      }
    }
  }
}
