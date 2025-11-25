import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResourceAssigmentService } from '../../core/services/resource-assigment.service';
import { ResourceService } from '../../core/services/resource.service';
import { AcademicSpaceService } from '../../core/services/academic-space.service';
import { Resource } from '../../core/models/resource.model';
import { AcademicSpace } from '../../core/models/academic-space';
import { ResourceAssignmentDetailsResponse, ResourceAssignmentRequest, ResourceAssignmentResponse } from '../../core/models/resource-assignment.model';

@Component({
  selector: 'app-resource-env',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resource-env.component.html',
  styleUrls: ['./resource-env.component.css']
})
export class ResourceEnvComponent implements OnInit {
  private raService = inject(ResourceAssigmentService);
  private resourceService = inject(ResourceService);
  private academicSpaceService = inject(AcademicSpaceService);

  details: ResourceAssignmentDetailsResponse[] = [];
  resources: Resource[] = [];
  academicSpaces: AcademicSpace[] = [];

  isLoading = false;
  error = '';

  editingId: number | null = null;

  f_idResource: number | null = null;
  f_idAcademicSpace: number | null = null;

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;
    this.loadLists();
    this.raService.getDetails().subscribe({
      next: (rows) => { this.details = rows; this.isLoading = false; },
      error: () => { this.details = []; this.isLoading = false; }
    });
    console.log(this.details);
  }

  private loadLists(): void {
    this.resourceService.getResources().subscribe({
      next: (res) => this.resources = res,
      error: () => this.resources = []
    });
    this.academicSpaceService.getAcademicSpaces().subscribe({
      next: (res) => this.academicSpaces = res,
      error: () => this.academicSpaces = []
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.f_idResource = null;
    this.f_idAcademicSpace = null;
  }

  create(): void {
    if (!this.f_idResource || !this.f_idAcademicSpace) return;
    const body: ResourceAssignmentRequest = {
      idResource: this.f_idResource,
      idAcademicSpace: this.f_idAcademicSpace,
    };
    this.raService.create(body).subscribe({
      next: () => { this.resetForm(); this.loadAll(); },
      error: () => {}
    });
  }

  startEdit(row: ResourceAssignmentDetailsResponse): void {
    const id = row?.idResourceAssignment;
    if (!id) return;
    this.editingId = id;
    this.raService.getById(id).subscribe({
      next: (r: ResourceAssignmentResponse) => {
        this.f_idAcademicSpace = r.idAcademicSpace ?? null as any;
        this.f_idResource = (r.resource?.idResource ?? null) as any;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => {}
    });
  }

  save(): void {
    if (this.editingId == null || !this.f_idResource || !this.f_idAcademicSpace) return;
    const body: ResourceAssignmentRequest = {
      idResource: this.f_idResource,
      idAcademicSpace: this.f_idAcademicSpace,
    };
    this.raService.update(this.editingId, body).subscribe({
      next: () => { this.resetForm(); this.loadAll(); },
      error: () => {}
    });
  }

  remove(row: ResourceAssignmentDetailsResponse): void {
    const id = row?.idResourceAssignment;
    if (!id) return;
    const ok = confirm('¿Eliminar asignación seleccionada?');
    if (!ok) return;
    this.raService.delete(id).subscribe({
      next: () => this.loadAll(),
      error: () => {}
    });
  }
}
