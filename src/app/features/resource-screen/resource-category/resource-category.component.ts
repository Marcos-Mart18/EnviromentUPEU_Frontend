import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryResource } from '../../../core/models/category-resource.model';
import { CategoryResourceService } from '../../../core/services/category-resource.service';

@Component({
  selector: 'app-resource-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resource-category.component.html',
  styleUrls: ['./resource-category.component.css'],
})
export class ResourceCategoryComponent implements OnInit {
  private readonly categoryService = inject(CategoryResourceService);
  private readonly router = inject(Router);

  categories: CategoryResource[] = [];
  name = '';
  isActive = true;

  editing = false;
  editingId: number | null = null;
  showCategoriesList = true;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategoryResources().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        this.categories = data.map(
          (it: any, idx: number) =>
            new CategoryResource(
              it.name ?? '—',
              it.isActive ?? true,
              it.idCategoryResource ?? it.id ?? idx + 1
            )
        );
      },
      error: () => {
        this.categories = [];
      },
    });
  }

  createOrUpdate(): void {
    const n = this.name.trim();
    if (!n) return;

    const body = {
      name: n,
      isActive: this.isActive,
    };

    if (this.editing && this.editingId != null) {
      this.categoryService.updateCategoryResource(this.editingId, body).subscribe({
        next: () => {
          this.resetForm();
          this.loadCategories();
        },
        error: () => {},
      });
    } else {
      this.categoryService.createCategoryResource(body).subscribe({
        next: () => {
          this.resetForm();
          this.loadCategories();
        },
        error: () => {},
      });
    }
  }

  edit(c: CategoryResource): void {
    this.editing = true;
    this.editingId = c.idCategoryResource ?? null;
    this.name = c.name;
    this.isActive = c.isActive;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  remove(c: CategoryResource): void {
    const ok = confirm(`¿Eliminar categoría \"${c.name}\"?`);
    if (!ok || !c.idCategoryResource) return;

    this.categoryService.deleteCategoryResource(c.idCategoryResource).subscribe({
      next: () => this.loadCategories(),
      error: () => {},
    });
  }

  resetForm(): void {
    this.name = '';
    this.isActive = true;
    this.editing = false;
    this.editingId = null;
  }

  volver(): void {
    this.router.navigate(['/main/res-creation']);
  }
}
