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

  pendingDeleteId?: number | null = null;
  pendingDeleteName = '';
  lastDeleted?: CategoryResource | null = null;
  popupStyle: { [k: string]: string } | null = null;
  showToast = false;
  toastMessage = '';
  toastSuccess = false;
  private toastTimer: any = null;

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

  confirmRemove(c: CategoryResource, ev?: MouseEvent): void {
    this.pendingDeleteId = c.idCategoryResource ?? null;
    this.pendingDeleteName = c.name;
    this.lastDeleted = new CategoryResource(c.name, c.isActive, c.idCategoryResource);

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

  cancelRemove(): void {
    this.pendingDeleteId = null;
    this.pendingDeleteName = '';
    this.popupStyle = null;
  }

  performDeleteConfirmed(): void {
    if (!this.pendingDeleteId) return;

    this.categoryService.deleteCategoryResource(this.pendingDeleteId).subscribe({
      next: () => {
        this.pendingDeleteId = null;
        this.pendingDeleteName = '';
        this.popupStyle = null;
        this.loadCategories();
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
