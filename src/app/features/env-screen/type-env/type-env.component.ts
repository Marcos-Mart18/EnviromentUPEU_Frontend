import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TypeAcademicSpace } from '../../../core/models/type-academic-space';
import { TypeAcademicSpaceService } from '../../../core/services/type-academic-space.service';

@Component({
  selector: 'app-type-env',
  imports: [CommonModule, FormsModule],
  templateUrl: './type-env.component.html',
  styleUrls: ['./type-env.component.css'],
})
export class TypeEnvComponent implements OnInit {
  constructor(private router: Router) {}

  nuevoNombre = '';
  editandoId?: number | null = null;
  search = '';

  private env = inject(TypeAcademicSpaceService);

  tipos: TypeAcademicSpace[] = [];

  ngOnInit(): void {
    this.cargarTipos();
  }

  private cargarTipos(): void {
    this.env.getTypeAcademicSpaces().subscribe({
      next: (res: any) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        this.tipos = items.map(
          (it: any, idx: number) =>
            new TypeAcademicSpace(
              it.name ?? it.nombre ?? '—',
              it.is_active ?? it.activo ?? 'A',
              it.id ?? it.id_type ?? idx + 1
            )
        );
      },
      error: () => {
        this.tipos = [];
      },
    });
  }

  get tiposFiltrados(): TypeAcademicSpace[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.tipos;
    return this.tipos.filter((t) => t.name.toLowerCase().includes(q));
  }

  crearOActualizar(): void {
    const nombre = this.nuevoNombre.trim();
    if (!nombre) return;

    if (this.editandoId == null) {
      this.env
        .createTypeAcademicSpace({ name: nombre, is_active: 'A' })
        .subscribe({
          next: () => {
            this.cargarTipos();
          },
          error: () => {},
        });
    } else {
      this.env
        .updateTypeAcademicSpace(this.editandoId, {
          name: nombre,
          is_active: 'A',
        })
        .subscribe({
          next: () => this.cargarTipos(),
          error: () => {},
        });
    }
    this.resetForm();
  }

  toggleEstado(t: TypeAcademicSpace): void {
    t.is_active = t.is_active === 'A' ? 'I' : 'A';
  }

  editar(t: TypeAcademicSpace): void {
    this.editandoId = t.id_type_academic_space;
    this.nuevoNombre = t.name;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion(): void {
    this.resetForm();
  }

  eliminar(t: TypeAcademicSpace): void {
    const ok = confirm(`¿Eliminar "${t.name}"?`);
    if (!ok) return;
    this.env.deleteTypeAcademicSpace(t.id_type_academic_space).subscribe({
      next: () => this.cargarTipos(),
      error: () => {},
    });
  }

  estadoChipClasses(is_active: string): string {
    return is_active === 'A'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-200 text-gray-700';
  }

  private resetForm(): void {
    this.nuevoNombre = '';
    this.editandoId = null;
  }

  trackById = (_: number, item: TypeAcademicSpace) =>
    item.id_type_academic_space;

  volver(): void {
    this.router.navigate(['/main/env-creation']);
  }
}
