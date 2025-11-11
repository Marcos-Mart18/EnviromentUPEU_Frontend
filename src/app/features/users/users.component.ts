import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { CreateUserProfileDTO, UpdateUserProfileDTO, UserProfileDTO } from '../../core/models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);

  users: UserProfileDTO[] = [];
  isLoading = false;
  error = '';
  showUsersList = true;

  // create
  c_names = '';
  c_lastName = '';
  c_email = '';
  c_phoneNumber = '';
  c_address = '';
  c_dob = '';
  c_isActive = true;

  // edit
  editingId: number | null = null;
  e_names = '';
  e_lastName = '';
  e_email = '';
  e_phoneNumber = '';
  e_address = '';
  e_dob = '';
  e_isActive: boolean = true;
  e_photoFile: File | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        console.log('users loaded', users);
        this.isLoading = false;
      },
      error: () => {
        this.users = [];
        this.isLoading = false;
      }
    });
  }

  create(): void {
    if (!this.c_names || !this.c_lastName || !this.c_email || !this.c_dob) return;
    const dto: CreateUserProfileDTO = {
      names: this.c_names,
      lastName: this.c_lastName,
      email: this.c_email,
      phoneNumber: this.c_phoneNumber,
      address: this.c_address,
      dob: this.c_dob,
      isActive: this.c_isActive,
    };
    this.userService.createUser(dto).subscribe({
      next: () => {
        this.resetCreate();
        this.load();
      },
      error: () => {}
    });
  }

  startEdit(u: UserProfileDTO): void {
    const id = this.getIdFromRow(u);
    console.log('startEdit row', u, 'resolvedId', id);
    if (id == null) {
      alert('No se pudo determinar el ID del perfil.');
      return;
    }
    this.editingId = id;
    this.e_photoFile = null;
    // Pre-cargar con los datos de la fila seleccionada para mostrar inmediatamente
    this.e_names = u.names ?? '';
    this.e_lastName = u.lastName ?? '';
    this.e_email = u.email ?? '';
    this.e_phoneNumber = u.phoneNumber ?? '';
    this.e_address = u.address ?? '';
    this.e_dob = this.formatDateForInput(u.dob);
    this.e_isActive = !!u.isActive;
    this.userService.getUser(this.editingId).subscribe({
      next: (p) => {
        this.e_names = p.names;
        this.e_lastName = p.lastName;
        this.e_email = p.email;
        this.e_phoneNumber = p.phoneNumber;
        this.e_address = p.address;
        this.e_dob = this.formatDateForInput(p.dob);
        this.e_isActive = p.isActive;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => {
        // fallback to provided row data if fetch fails
        this.e_names = u.names ?? '';
        this.e_lastName = u.lastName ?? '';
        this.e_email = u.email ?? '';
        this.e_phoneNumber = u.phoneNumber ?? '';
        this.e_address = u.address ?? '';
        this.e_dob = this.formatDateForInput(u.dob);
        this.e_isActive = !!u.isActive;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  cancel(): void {
    this.editingId = null;
    this.e_names = '';
    this.e_lastName = '';
    this.e_email = '';
    this.e_phoneNumber = '';
    this.e_address = '';
    this.e_dob = '';
    this.e_isActive = true;
    this.e_photoFile = null;
  }

  save(): void {
    if (this.editingId == null) return;
    const dto: UpdateUserProfileDTO = {
      names: this.e_names,
      lastName: this.e_lastName,
      email: this.e_email,
      phoneNumber: this.e_phoneNumber,
      address: this.e_address,
      dob: this.e_dob,
    };
    this.userService.updateUser(this.editingId, dto).subscribe({
      next: () => {
        this.cancel();
        this.load();
      },
      error: () => {}
    });
  }

  remove(u: UserProfileDTO): void {
    const fullName = `${u.names} ${u.lastName}`.trim();
    const ok = confirm(`¿Eliminar usuario "${fullName}"?`);
    if (!ok) return;
    const id = this.getIdFromRow(u);
    console.log('delete clicked', { row: u, id });
    if (id == null) {
      alert('No se pudo determinar el ID del perfil.');
      return;
    }
    this.userService.deleteUser(id).subscribe({
      next: () => this.load(),
      error: (err) => { alert('No se pudo eliminar.'); console.error('delete error', err); }
    });
  }

  private resetCreate(): void {
    this.c_names = '';
    this.c_lastName = '';
    this.c_email = '';
    this.c_phoneNumber = '';
    this.c_address = '';
    this.c_dob = '';
    this.c_isActive = true;
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.e_photoFile = input.files[0];
    }
  }

  uploadPhoto(): void {
    if (this.editingId == null || !this.e_photoFile) return;
    this.userService.updateProfilePicture(this.editingId, this.e_photoFile).subscribe({
      next: () => {
        this.e_photoFile = null;
        this.load();
      },
      error: () => {}
    });
  }

  private formatDateForInput(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    // Accepts ISO strings like 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm:ssZ'
    const idx = dateStr.indexOf('T');
    return idx > 0 ? dateStr.substring(0, idx) : dateStr;
  }

  private getIdFromRow(u: any): number | null {
    const raw = (u?.id ?? u?.userProfileId ?? u?.idUserProfile ?? u?.id_user_profile);
    const num = Number(raw);
    return Number.isFinite(num) ? num : null;
  }

  toggleActive(u: UserProfileDTO, event?: Event): void {
    if (event) event.stopPropagation();
    const id = this.getIdFromRow(u);
    if (id == null) { alert('No se pudo determinar el ID del perfil.'); return; }
    const obs = u.isActive ? this.userService.deactivateUserProfile(id) : this.userService.activateUserProfile(id);
    obs.subscribe({
      next: () => this.load(),
      error: (err) => { console.error('toggle active error', err); }
    });
  }
}
