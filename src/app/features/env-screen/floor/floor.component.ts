import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FloorService } from '../../../core/services/floor.service';
import { BuildingService } from '../../../core/services/building.service';
import { Floor } from '../../../core/models/floor';
import { Building } from '../../../core/models/building';

@Component({
  selector: 'app-floor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.css'],
})
export class FloorComponent implements OnInit {
  private floorService = inject(FloorService);
  private buildingService = inject(BuildingService);
  private router = inject(Router);

  floors: Floor[] = [];
  buildings: Building[] = [];

  floorNumber: number | null = null;
  buildingId?: number | null = null;
  editingId?: number | null = null;
  editingFloorNumber: number | null = null;
  editingBuildingId?: number | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.buildingService.getBuildings().subscribe({
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
              it.is_active ?? '',
              it.id ?? it.id_building ?? idx + 1
            )
        );
      },
      error: () => {
        this.buildings = [];
      },
    });

    this.floorService.getFloors().subscribe({
      next: (res: any) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        this.floors = items.map((it: any, idx: number) => {
          const id_floor = it.id ?? it.id_floor ?? idx + 1;
          const floor_number = Number(it.floor_number ?? 0);
          const buildingId = Number(it.id_building ?? it.building_id ?? 0);
          const buildingObj =
            this.buildings.find((b) => b.id_building === buildingId) ??
            new Building('', '', buildingId);
          return new Floor(
            floor_number,
            it.is_active ?? 'A',
            buildingObj,
            id_floor
          );
        });
      },
      error: () => {
        this.floors = [];
      },
    });
  }

  create(): void {
    if (this.floorNumber == null || this.buildingId == null) {
      return console.log('Invalid floor or building ID');
    }
    this.floorService
      .createFloor({
        floor_number: Number(this.floorNumber),
        is_active: 'A',
        id_building: Number(this.buildingId),
      })
      .subscribe({
        next: () => {
          this.floorNumber = null;
          this.buildingId = null;
          this.load();
        },
        error: () => {},
      });
  }

  edit(f: Floor): void {
    this.editingId = f.id_floor;
    this.editingFloorNumber = f.floor_number;
    this.editingBuildingId = f.building.id_building;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancel(): void {
    this.editingId = null;
    this.editingFloorNumber = null;
    this.editingBuildingId = null;
  }

  save(): void {
    if (
      this.editingId == null ||
      this.editingFloorNumber == null ||
      this.editingBuildingId == null
    )
      return;
    this.floorService
      .updateFloor(this.editingId, {
        floor_number: Number(this.editingFloorNumber),
        is_active: 'A',
        id_building: Number(this.editingBuildingId),
      })
      .subscribe({
        next: () => {
          this.cancel();
          this.load();
        },
        error: () => {},
      });
  }

  remove(f: Floor): void {
    const ok = confirm(`¿Eliminar piso ${f.floor_number}?`);
    if (!ok) return;
    this.floorService.deleteFloor(f.id_floor).subscribe({
      next: () => this.load(),
      error: () => {},
    });
  }

  getBuildingName(id?: number): string {
    const b = this.buildings.find((x) => x.id_building === id);
    console.log(b?.name);
    return b ? b.name : String(id ?? '');
  }

  volver(): void {
    this.router.navigate(['/main/env-creation']);
  }
}
