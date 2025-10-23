import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BuildingService } from '../../../core/services/building.service';
import { Building } from '../../../core/models/building';
import { FloorService } from '../../../core/services/floor.service';
import { Floor } from '../../../core/models/floor';

@Component({
  selector: 'app-building',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css'],
})
export class BuildingComponent implements OnInit {
  private env = inject(BuildingService);
  private floorService = inject(FloorService);
  private router = inject(Router);

  buildings: Building[] = [];
  name = '';
  editingId?: number | null = null;
  editingName = '';
  // Para gestionar pisos en esta pantalla
  selectedBuildingIdForFloors?: number | null = null;
  floorsForSelected: Floor[] = [];
  newFloorNumber: number | null = null;
  // selector para ver pabellón desde abajo
  viewBuildingId?: number | null = null;
  // toggle para mostrar/ocultar lista de buildings
  showBuildingsList = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.env.getBuildings().subscribe({
      next: (res: any) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        this.buildings = items.map(
          (it: any, idx: number) =>
            new Building(
              it.name ?? '—',
              it.is_active ?? 'A',
              it.id ?? it.id_building ?? idx + 1
            )
        );
      },
      error: () => {
        this.buildings = [];
      },
    });
  }

  // Cargar pisos para el pabellón seleccionado
  loadFloorsForBuilding(id?: number | null): void {
    if (id == null) {
      this.floorsForSelected = [];
      return;
    }
    this.env.getFloorByBuilding(Number(id)).subscribe({
      next: (res: any) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        const b = this.buildings.find((x) => x.id_building === Number(id));
        this.floorsForSelected = items.map((it: any, idx: number) => {
          const id_floor = it.id ?? it.id_floor ?? idx + 1;
          const floor_number = Number(it.floor_number ?? 0);
          const buildingObj =
            b ??
            new Building(
              it.building?.name ?? '',
              it.building?.is_active ?? 'A',
              it.building?.id_building ?? Number(id)
            );
          return new Floor(
            floor_number,
            it.is_active ?? 'A',
            buildingObj,
            id_floor
          );
        });
      },
      error: () => {
        this.floorsForSelected = [];
      },
    });
  }

  onViewBuildingChange(id?: number | null): void {
    this.viewBuildingId = id ?? null;
    // también sincronizamos la vista de pisos con el pabellón elegido
    this.selectedBuildingIdForFloors = id ?? null;
    this.loadFloorsForBuilding(id ?? null);
  }

  get viewBuildingName(): string {
    if (this.viewBuildingId == null) return '';
    return (
      this.buildings.find((b) => b.id_building === this.viewBuildingId)?.name ??
      ''
    );
  }

  createFloorForBuilding(): void {
    if (this.newFloorNumber == null || this.selectedBuildingIdForFloors == null)
      return;
    this.floorService
      .createFloor({
        floor_number: Number(this.newFloorNumber),
        id_building: Number(this.selectedBuildingIdForFloors),
        is_active: 'A',
      })
      .subscribe({
        next: () => {
          this.newFloorNumber = null;
          // recargar la lista de pisos del building seleccionado
          this.loadFloorsForBuilding(this.selectedBuildingIdForFloors);
        },
        error: () => {},
      });
  }

  create(): void {
    const n = this.name.trim();
    if (!n) return;
    this.env.createBuilding({ name: n, is_active: 'A' }).subscribe({
      next: () => {
        this.name = '';
        this.load();
      },
      error: () => {},
    });
  }

  edit(b: Building): void {
    this.editingId = b.id_building;
    this.editingName = b.name;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancel(): void {
    this.editingId = null;
    this.editingName = '';
  }

  save(): void {
    if (this.editingId == null) return;
    const n = this.editingName.trim();
    if (!n) return;
    this.env
      .updateBuilding(this.editingId, { name: n, is_active: 'A' })
      .subscribe({
        next: () => {
          this.cancel();
          this.load();
        },
        error: () => {},
      });
  }

  remove(b: Building): void {
    const ok = confirm(`¿Eliminar "${b.name}"?`);
    if (!ok) return;
    this.env.deleteBuilding(b.id_building).subscribe({
      next: () => this.load(),
      error: () => {},
    });
  }

  volver(): void {
    this.router.navigate(['/main/env-creation']);
  }
}
