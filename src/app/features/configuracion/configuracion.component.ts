import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { UpdateUserProfileDTO, UserProfileDTO } from '../../core/models/user.model';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  profileId: number | null = null;
  loading = false;
  uploadingPhoto = false;

  names = '';
  lastName = '';
  email = '';
  phoneNumber = '';
  address = '';
  dob = '';
  isActive = true;
  profilePicture: string | undefined = undefined;
  saveSuccess = false;

  photoFile: File | null = null;

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user?.userProfileId) {
      this.profileId = user.userProfileId;
      this.loadProfile(this.profileId);
    }
  }

  loadProfile(id: number): void {
    this.loading = true;
    this.userService.getUser(id).subscribe({
      next: (p: UserProfileDTO) => {
        this.names = p.names;
        this.lastName = p.lastName;
        this.email = p.email;
        this.phoneNumber = p.phoneNumber;
        this.address = p.address;
        this.dob = p.dob;
        this.isActive = p.isActive;
        this.profilePicture = p.profilePicture;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  save(): void {
    if (this.profileId == null) return;
    const dto: UpdateUserProfileDTO = {
      names: this.names,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      address: this.address,
      dob: this.dob,
      isActive: this.isActive,
    };
    this.userService.updateUser(this.profileId, dto).subscribe({
      next: () => {
        this.saveSuccess = true;
        setTimeout(() => (this.saveSuccess = false), 3000);
      }
    });
  }

  onPhotoSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    if (input.files && input.files.length > 0) this.photoFile = input.files[0];
  }

  uploadPhoto(): void {
    if (this.profileId == null || !this.photoFile) return;
    this.uploadingPhoto = true;
    this.userService.updateProfilePicture(this.profileId, this.photoFile).subscribe({
      next: () => {
        this.photoFile = null;
        this.loadProfile(this.profileId!);
        this.uploadingPhoto = false;
      },
      error: () => {
        this.uploadingPhoto = false;
      }
    });
  }
}
