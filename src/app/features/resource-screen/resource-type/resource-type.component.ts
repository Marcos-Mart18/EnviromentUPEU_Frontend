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
