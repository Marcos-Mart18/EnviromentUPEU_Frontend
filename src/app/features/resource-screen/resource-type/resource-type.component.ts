import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResourceType } from '../../../core/models/resource-type.model';
import { CategoryResource } from '../../../core/models/category-resource.model';
import { ResourceTypeService } from '../../../core/services/resource-type.service';
import { CategoryResourceService } from '../../../core/services/category-resource.service';

@Component({
  selector: 'app-resource-type',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resource-type.component.html',
  styleUrls: ['./resource-type.component.css'],
})
export class ResourceTypeComponent implements OnInit {
  // Inyecciones
  private resourceTypeService = inject(ResourceTypeService);
  private categoryResourceService = inject(CategoryResourceService);
  private router = inject(Router);

  // Datos principales
  resourceTypes: ResourceType[] = [];
  categories: CategoryResource[] = [];

  // Campos de formulario
  name = '';
  isActive = true;
  selectedCategory: CategoryResource | null = null;

  // Control de edición
  editingId?: number | null = null;
  editing = false;

  // Mostrar u ocultar lista
  showResourceTypesList = true;

  // Confirmación de eliminación y mensajes
  pendingDeleteId?: number | null = null;
  pendingDeleteName = '';
  lastDeleted?: ResourceType | null = null;
  popupStyle: { [k: string]: string } | null = null;
  showToast = false;
  toastMessage = '';
  toastSuccess = false;
  private toastTimer: any = null;

  ngOnInit(): void {
    this.loadResourceTypes();
    this.loadCategories();
  }

  // 🔹 Cargar lista de tipos de recursos
  loadResourceTypes(): void {
    this.resourceTypeService.getResourceTypes().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        console.log(data);
        this.resourceTypes = data.map(
          (it: any, idx: number) =>
            new ResourceType(
              it.name ?? '—',
              it.isActive ?? true,
              it.idResourceType ?? it.id ?? idx + 1,
              it.categoryResource
                ? new CategoryResource(
                    it.categoryResource.name ?? '',
                    it.categoryResource.isActive ?? true,
                    it.categoryResource.idCategoryResource
                  )
                : undefined
            )
        );
      },
      error: () => {
        this.resourceTypes = [];
      },
    });
  }

  // 🔹 Cargar categorías para el selector
  loadCategories(): void {
    this.categoryResourceService.getCategoryResources().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        this.categories = data
          .map(
            (it: any, idx: number) =>
              new CategoryResource(
                it.name ?? '—',
                it.isActive ?? true,
                it.idCategoryResource ?? it.id ?? idx + 1
              )
          )
          .filter((c: CategoryResource) => c.isActive === true);
      },
      error: () => {
        this.categories = [];
      },
    });
  }

  // 🔹 Crear o actualizar
  createOrUpdate(): void {
    const n = this.name.trim();
    if (!n) return;
    if (!this.selectedCategory?.idCategoryResource) return;

    const body = {
      name: n,
      isActive: this.isActive,
      idCategoryResource: this.selectedCategory?.idCategoryResource,
    } as any;

    if (this.editing && this.editingId != null) {
      this.resourceTypeService.updateResourceType(this.editingId, body).subscribe({
        next: () => {
          this.resetForm();
          this.loadResourceTypes();
        },
        error: () => {},
      });
    } else {
      this.resourceTypeService.createResourceType(body).subscribe({
        next: () => {
          this.resetForm();
          this.loadResourceTypes();
        },
        error: () => {},
      });
    }
  }

  // 🔹 Editar registro existente
  edit(rt: ResourceType): void {
    this.editing = true;
    this.editingId = rt.idResourceType ?? null;
    this.name = rt.name;
    this.isActive = rt.isActive;
    this.selectedCategory = rt.categoryResource
      ? this.categories.find(
          (c) => c.idCategoryResource === rt.categoryResource?.idCategoryResource
        ) ?? null
      : null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 🔹 Eliminar registro
  remove(rt: ResourceType): void {
    const ok = confirm(`¿Eliminar tipo de recurso "${rt.name}"?`);
    if (!ok || !rt.idResourceType) return;

    this.resourceTypeService.deleteResourceType(rt.idResourceType).subscribe({
      next: () => this.loadResourceTypes(),
      error: () => {},
    });
  }

  // Abrir confirmación de eliminación
  confirmRemove(rt: ResourceType, ev?: MouseEvent): void {
    this.pendingDeleteId = rt.idResourceType ?? null;
    this.pendingDeleteName = rt.name;
    this.lastDeleted = new ResourceType(rt.name, rt.isActive, rt.idResourceType, rt.categoryResource);

    const btn = ev?.currentTarget as HTMLElement;
    const rect = btn?.getBoundingClientRect();
    const popupW = 224;
    const popupH = 96;
    let top: number;
    let left: number;

    if (rect) {
      top = rect.top > popupH + 20 ? rect.top - popupH - 8 : rect.bottom + 8;
      left = rect.left + rect.width / 2 - popupW / 2;
      const minLeft = 8;
      const maxLeft = Math.max(8, window.innerWidth - popupW - 8);
      left = Math.min(Math.max(left, minLeft), maxLeft);
    } else {
      top = Math.max(8, window.innerHeight / 2 - popupH / 2);
      left = Math.max(8, window.innerWidth / 2 - popupW / 2);
    }

    this.popupStyle = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
    };
  }

  // Cancelar confirmación
  cancelRemove(): void {
    this.pendingDeleteId = null;
    this.pendingDeleteName = '';
    this.popupStyle = null;
  }

  // Ejecutar eliminación confirmada
  performDeleteConfirmed(): void {
    if (!this.pendingDeleteId) return;

    this.resourceTypeService.deleteResourceType(this.pendingDeleteId).subscribe({
      next: () => {
        this.pendingDeleteId = null;
        this.pendingDeleteName = '';
        this.popupStyle = null;
        this.loadResourceTypes();
        this.showToastMessage('Eliminado correctamente', true);
      },
      error: () => {
        this.pendingDeleteId = null;
        this.pendingDeleteName = '';
        this.popupStyle = null;
        this.showToastMessage('Error al eliminar', false);
      },
    });
  }

  // Mostrar mensaje toast
  private showToastMessage(message: string, isSuccess: boolean): void {
    this.toastMessage = message;
    this.showToast = true;
    this.toastSuccess = isSuccess;
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastTimer = setTimeout(() => {
      this.showToast = false;
      this.toastMessage = '';
      this.toastSuccess = false;
    }, 5000);
  }

  // 🔹 Cancelar edición y limpiar formulario
  resetForm(): void {
    this.name = '';
    this.isActive = true;
    this.selectedCategory = null;
    this.editing = false;
    this.editingId = null;
  }

  // 🔹 Navegar atrás
  volver(): void {
    this.router.navigate(['/main/res-creation']);
  }
}
