import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserProfileDTO } from '../../../core/models/user.model';
import { AuthUserDTO, CreateAuthUserRequest, UpdateAuthUserRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  profileId!: number;
  loading = false;
  profile: UserProfileDTO | null = null;

  photoFile: File | null = null;

  authUser: AuthUserDTO | null = null;
  creatingAuth = false;

  c_username = '';
  c_password = '';

  e_username = '';
  e_password = '';
  e_isActive = true;

  roleName = '';

  ngOnInit(): void {
    this.profileId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.userService.getUser(this.profileId).subscribe({
      next: (p) => {
        this.profile = p;
        this.loading = false;
      },
      error: () => {
        this.profile = null;
        this.loading = false;
      }
    });

    this.loadAuthUser();
  }

  loadAuthUser(): void {
    this.authService.getAuthUserByProfileId(this.profileId).subscribe({
      next: (u) => {
        this.authUser = u;
        this.creatingAuth = false;
        this.e_username = u.username;
        this.e_isActive = u.isActive;
      },
      error: () => {
        this.authUser = null;
        this.creatingAuth = true;
      }
    });
    console.log('Loading auth user for profile ID:', this.profileId);
  }

  onPhotoSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    if (input.files && input.files.length) this.photoFile = input.files[0];
  }

  uploadPhoto(): void {
    if (!this.profile || !this.photoFile) return;
    this.userService.updateProfilePicture(this.profile.id, this.photoFile).subscribe({
      next: (p) => { this.profile = p; this.photoFile = null; },
    });
  }

  createAuth(): void {
    if (!this.c_username || !this.c_password) return;
    const payload: CreateAuthUserRequest = {
      username: this.c_username,
      password: this.c_password,
      userProfileId: this.profileId,
    };
    this.authService.createAuthUser(payload).subscribe({
      next: (u) => { this.authUser = u; this.creatingAuth = false; this.e_username = u.username; this.e_isActive = u.isActive; },
    });
    console.log('Creating auth user with payload:', payload);
  }

  updateAuth(): void {
    if (!this.authUser) return;
    const payload: UpdateAuthUserRequest = {
      username: this.e_username || undefined,
      password: this.e_password || undefined,
      isActive: this.e_isActive,
      userProfileId: this.profileId,
    };
    this.authService.updateAuthUser(this.authUser.id, payload).subscribe({
      next: (u) => { this.authUser = u; this.e_password = ''; },
    });
  }

  deleteAuth(): void {
    if (!this.authUser) return;
    const ok = confirm('¿Eliminar credenciales de autenticación?');
    if (!ok) return;
    this.authService.deleteAuthUser(this.authUser.id).subscribe({
      next: () => { this.authUser = null; this.creatingAuth = true; },
    });
  }

  assignRole(): void {
    if (!this.authUser || !this.roleName) return;
    this.authService.assignRoleToUser(this.authUser.id, this.roleName).subscribe({
      next: (u) => { this.authUser = u; this.roleName = ''; },
    });
  }

  removeRole(name: string): void {
    if (!this.authUser) return;
    this.authService.removeRoleFromUser(this.authUser.id, name).subscribe({
      next: (u) => { this.authUser = u; },
    });
  }
}
