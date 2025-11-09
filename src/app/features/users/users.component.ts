import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { CreateUserDTO, UpdateUserDTO, UserDTO } from '../../core/models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);

  users: UserDTO[] = [];
  isLoading = false;
  error = '';

  // create
  c_username = '';
  c_password = '';
  c_userProfileId: number | null = null;

  // edit
  editingId: number | null = null;
  e_username = '';
  e_password = '';
  e_userProfileId: number | null = null;
  e_isActive: boolean = true;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: () => {
        this.users = [];
        this.isLoading = false;
      }
    });
  }

  create(): void {
    if (!this.c_username || !this.c_password || !this.c_userProfileId) return;
    const dto: CreateUserDTO = {
      username: this.c_username,
      password: this.c_password,
      userProfileId: this.c_userProfileId,
    };
    this.userService.createUser(dto).subscribe({
      next: () => {
        this.resetCreate();
        this.load();
      },
      error: () => {}
    });
  }

  startEdit(u: UserDTO): void {
    this.editingId = u.id;
    this.e_username = u.username;
    this.e_password = '';
    this.e_userProfileId = u.userProfileId;
    this.e_isActive = u.isActive;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancel(): void {
    this.editingId = null;
    this.e_username = '';
    this.e_password = '';
    this.e_userProfileId = null;
    this.e_isActive = true;
  }

  save(): void {
    if (this.editingId == null) return;
    const dto: UpdateUserDTO = {
      username: this.e_username,
      isActive: this.e_isActive,
      userProfileId: this.e_userProfileId ?? undefined,
    };
    if (this.e_password) dto.password = this.e_password;
    this.userService.updateUser(this.editingId, dto).subscribe({
      next: () => {
        this.cancel();
        this.load();
      },
      error: () => {}
    });
  }

  remove(u: UserDTO): void {
    const ok = confirm(`¿Eliminar usuario "${u.username}"?`);
    if (!ok) return;
    this.userService.deleteUser(u.id).subscribe({
      next: () => this.load(),
      error: () => {}
    });
  }

  private resetCreate(): void {
    this.c_username = '';
    this.c_password = '';
    this.c_userProfileId = null;
  }
}
