import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../core/services/role.service';
import { RoleDTO, CreateRoleDTO, UpdateRoleDTO } from '../../core/models/role.model';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  private roleService = inject(RoleService);

  roles: RoleDTO[] = [];
  isLoading = false;
  error = '';

  r_name = '';
  r_isActive = true;

  editingId: number | null = null;
  e_name = '';
  e_isActive = true;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.roleService.listRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.isLoading = false;
      },
      error: () => {
        this.roles = [];
        this.isLoading = false;
      }
    });
  }

  create(): void {
    if (!this.r_name) return;
    const dto: CreateRoleDTO = {
      name: this.r_name,
      isActive: this.r_isActive,
    };
    this.roleService.createRole(dto).subscribe({
      next: () => {
        this.r_name = '';
        this.r_isActive = true;
        this.load();
      },
      error: () => {}
    });
  }

  startEdit(r: RoleDTO): void {
    this.editingId = r.id;
    this.e_name = r.name;
    this.e_isActive = r.isActive;
  }

  cancel(): void {
    this.editingId = null;
    this.e_name = '';
    this.e_isActive = true;
  }

  save(): void {
    if (this.editingId == null) return;
    const dto: UpdateRoleDTO = {
      name: this.e_name,
      isActive: this.e_isActive,
    };
    this.roleService.updateRole(this.editingId, dto).subscribe({
      next: () => {
        this.cancel();
        this.load();
      },
      error: () => {}
    });
  }

  remove(r: RoleDTO): void {
    const ok = confirm(`¿Eliminar rol "${r.name}"?`);
    if (!ok) return;
    this.roleService.deleteRole(r.id).subscribe({
      next: () => this.load(),
      error: () => {}
    });
  }
}
