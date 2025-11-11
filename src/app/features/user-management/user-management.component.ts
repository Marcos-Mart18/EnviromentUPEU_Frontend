import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UsersComponent } from '../users/users.component';
import { RolesComponent } from '../roles/roles.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, UsersComponent, RolesComponent],
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent {
  activeTab: 'users' | 'roles' = 'users';

  setTab(tab: 'users' | 'roles') {
    this.activeTab = tab;
  }
}
