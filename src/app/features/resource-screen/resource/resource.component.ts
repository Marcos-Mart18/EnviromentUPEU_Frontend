import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResourceService } from '../../../core/services/resource.service';
import { Resource } from '../../../core/models/resource.model';
import { ResourceTypeService } from '../../../core/services/resource-type.service';
import { ResourceType } from '../../../core/models/resource-type.model';
import { StateService } from '../../../core/services/state.service';
import { ResourceState } from '../../../core/models/resource-state.model';

@Component({
  selector: 'app-resource',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css'],
})
export class ResourceComponent implements OnInit {
  private resourceService = inject(ResourceService);
  private resourceTypeService = inject(ResourceTypeService);
  private stateService = inject(StateService);
  private router = inject(Router);

  showResourcesList: boolean = true;

  // Listas principales
  resources: Resource[] = [];
  resourceTypes: ResourceType[] = [];
  states: ResourceState[] = [];

  // Variables para crear
  code = '';
  stock?: number | null = null;
  observation = '';
  resourcePhotoUrl = '';
  idResourceType?: number | null = null;
  idState?: number | null = null;

  // Variables para edición
  editingId?: number | null = null;
  editingCode = '';
  editingStock?: number | null = null;
  editingObservation = '';
  editingPhotoUrl = '';
  editingIdResourceType?: number | null = null;
  editingIdState?: number | null = null;

  ngOnInit(): void {
    this.load();
    this.loadResourceTypes();
    this.loadStates();
  }

  /** Cargar lista principal de recursos */
  load(): void {
    this.resourceService.getResources().subscribe({
      next: (res: any) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];

        this.resources = items.map((it: any, idx: number) => {
          const id = it.idResource ?? it.id ?? idx + 1;
          const type =
            it.resourceType ??
            new ResourceType(
              it.resource_type?.name ?? '—',
              it.resource_type?.isActive ?? true,
              it.resource_type?.idCategoryResource ?? undefined,
              it.resource_type?.idResourceType ?? undefined
            );

          const state =
            it.state ??
            new ResourceState(
              it.state?.name ?? '—',
              it.state?.isActive ?? true,
              it.state?.idState ?? undefined
            );

          return new Resource(
            it.code ?? '',
            it.stock ?? 0,
            it.resourcePhotoUrl ?? '',
            it.observation ?? '',
            it.idResourceType ?? type.idResourceType,
            it.idState ?? state.idState,
            id,
            type,
            state
          );
        });
      },
      error: () => {
        this.resources = [];
      },
    });
  }

  /** Cargar tipos de recurso */
  loadResourceTypes(): void {
    this.resourceTypeService.getResourceTypes().subscribe({
      next: (res: any) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        this.resourceTypes = items.map(
          (it: any, idx: number) =>
            new ResourceType(
              it.name ?? '—',
              it.isActive ?? true,
              it.idCategoryResource ?? undefined,
              it.idResourceType ?? idx + 1
            )
        );
      },
      error: () => {
        this.resourceTypes = [];
      },
    });
  }

  /** Cargar estados */
  loadStates(): void {
    this.stateService.getStates().subscribe({
      next: (res: any) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        this.states = items.map(
          (it: any, idx: number) =>
            new ResourceState(it.name ?? '—', it.isActive ?? true, it.idState ?? idx + 1)
        );
      },
      error: () => {
        this.states = [];
      },
    });
  }

  /** Crear nuevo recurso */
  create(): void {
    const c = this.code.trim();
    if (!c) return;
    this.resourceService
      .createResource({
        code: c,
        stock: this.stock ?? 0,
        resourcePhotoUrl: this.resourcePhotoUrl?.trim() || '',
        observation: this.observation?.trim() || '',
        idResourceType: this.idResourceType ?? undefined,
        idState: this.idState ?? undefined,
      })
      .subscribe({
        next: () => {
          this.resetCreateForm();
          this.load();
        },
        error: () => {},
      });
  }

  /** Iniciar edición */
  edit(r: Resource): void {
    this.editingId = r.idResource;
    this.editingCode = r.code;
    this.editingStock = r.stock ?? 0;
    this.editingObservation = r.observation ?? '';
    this.editingPhotoUrl = r.resourcePhotoUrl ?? '';
    this.editingIdResourceType = r.idResourceType ?? null;
    this.editingIdState = r.idState ?? null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Cancelar edición */
  cancel(): void {
    this.editingId = null;
    this.editingCode = '';
    this.editingStock = null;
    this.editingObservation = '';
    this.editingPhotoUrl = '';
    this.editingIdResourceType = null;
    this.editingIdState = null;
  }

  /** Guardar cambios de edición */
  save(): void {
    if (this.editingId == null) return;
    const c = this.editingCode.trim();
    if (!c) return;
    this.resourceService
      .updateResource(this.editingId, {
        code: c,
        stock: this.editingStock ?? 0,
        resourcePhotoUrl: this.editingPhotoUrl?.trim() || '',
        observation: this.editingObservation?.trim() || '',
        idResourceType: this.editingIdResourceType ?? undefined,
        idState: this.editingIdState ?? undefined,
      })
      .subscribe({
        next: () => {
          this.cancel();
          this.load();
        },
        error: () => {},
      });
  }

  /** Eliminar un recurso */
  remove(r: Resource): void {
    const ok = confirm(`¿Eliminar el recurso "${r.code}"?`);
    if (!ok || !r.idResource) return;
    this.resourceService.deleteResource(r.idResource).subscribe({
      next: () => this.load(),
      error: () => {},
    });
  }

  /** Volver a pantalla anterior */
  volver(): void {
    this.router.navigate(['/main/res-creation']);
  }

  /** Resetear formulario de creación */
  private resetCreateForm(): void {
    this.code = '';
    this.stock = null;
    this.resourcePhotoUrl = '';
    this.observation = '';
    this.idResourceType = null;
    this.idState = null;
  }
}
