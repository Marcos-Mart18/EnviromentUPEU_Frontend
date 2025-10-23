import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TypeAcademicSpace } from '../../../core/models/type-academic-space';
import { State } from '../../../core/models/state';
import { AcademicSpace } from '../../../core/models/academic-space';
import { Floor } from '../../../core/models/floor';
import { Building } from '../../../core/models/building';
import { AcademicSpaceService } from '../../../core/services/academic-space.service';
import { TypeAcademicSpaceService } from '../../../core/services/type-academic-space.service';
import { StateService } from '../../../core/services/state.service';
import { BuildingService } from '../../../core/services/building.service';
import { forkJoin } from 'rxjs';

// Vista local para la plantilla (aliases + referencia al modelo)
interface AmbienteView {
  id: number;
  id_academic_space?: number;
  nombre: string;
  tipoId: number | null;
  capacidad: number;
  estado: string;
  pisoId?: number | null;
  buildingId?: number | null;
  observation?: string;
  location?: string;
  model?: AcademicSpace;
}

@Component({
  selector: 'app-ambiente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ambiente.component.html',
  styleUrls: ['./ambiente.component.css'],
})
export class AmbienteComponent implements OnInit {
  // --- Colores base (coincide con el mock) ---
  readonly verde = '#BFC621';

  constructor(private router: Router) {}
  private academicSpaceService = inject(AcademicSpaceService);
  private typeAcademicSpaceService = inject(TypeAcademicSpaceService);
  private stateService = inject(StateService);
  private buildingService = inject(BuildingService);

  // --- Tipos disponibles para el select ---
  tipos: TypeAcademicSpace[] = [];
  estados: State[] = [];
  floors: Floor[] = [];
  buildings: Building[] = [];

  // --- Datos cargados del backend (vista para la plantilla) ---
  ambientes: AmbienteView[] = [];
  private buildingsLoaded = false;
  private floorsLoaded = false;

  ngOnInit(): void {
    this.cargarTipos();
    this.cargarEstados();
    this.cargarBuildings();
    this.cargarPisos();
  }

  private cargarTipos(): void {
    this.typeAcademicSpaceService.getTypeAcademicSpaces().subscribe({
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
              it.is_active ?? '',
              it.id ?? it.id_type ?? idx + 1
            )
        );
      },
      error: () => {
        this.tipos = [];
      },
    });
  }

  private cargarAmbientes(): void {
    this.academicSpaceService.getAcademicSpaces().subscribe({
      next: (res: any) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        this.ambientes = items.map((it: any, idx: number) => {
          const id_academic_space = it.id ?? idx + 1;
          const space_name = it.space_name ?? it.nombre ?? '—';
          const capacity = Number(it.capacity ?? 0);
          const observation = it.observation ?? it.observacion ?? '';
          const location = it.location ?? it.localizacion ?? '';

          const pisoIdRaw = it.id_floor ?? it.idFloor ?? it.floor_id ?? null;
          const pisoId = pisoIdRaw != null ? Number(pisoIdRaw) : null;

          // intentar obtener building desde el propio registro o desde el piso
          const buildingIdRaw =
            it.id_building ?? it.idBuilding ?? it.building_id ?? null;
          const buildingIdNum =
            buildingIdRaw != null ? Number(buildingIdRaw) : null;

          // encontrar building y floor ya instanciados (si existen)
          let buildingObj: Building | undefined = undefined;
          if (buildingIdNum != null) {
            buildingObj = this.buildings.find(
              (b) => b.id_building === buildingIdNum
            );
          }
          if (!buildingObj && buildingIdNum != null) {
            buildingObj = new Building('', '', buildingIdNum);
          }

          let floorObj: Floor | undefined = undefined;
          if (pisoId != null) {
            floorObj = this.floors.find((f) => f.id_floor === pisoId);
          }
          if (!floorObj) {
            // si no existe el floor, crear uno mínimo si tenemos building
            const floorNumber = Number(it.floor_number ?? 0);
            const buildingForFloor =
              buildingObj ??
              (buildingIdNum != null
                ? new Building('', '', buildingIdNum)
                : new Building('', '', 0));
            floorObj = new Floor(
              floorNumber,
              it.is_active ?? '',
              buildingForFloor,
              pisoId ?? undefined
            );
          }

          // estado
          const estadoRaw = it.id_state ?? it.idState ?? it.state ?? null;
          let stateObj: State | undefined = undefined;
          if (estadoRaw != null) {
            stateObj = this.estados.find(
              (s) => s.id_state === Number(estadoRaw)
            );
          }
          if (!stateObj) {
            const estadoNombre = (it.state_name ?? it.estado ?? '') as string;
            stateObj = new State(
              estadoNombre || (this.estados[0]?.name ?? ''),
              it.is_active ?? '',
              Number(estadoRaw) || undefined
            );
          }

          // tipo
          const tipoRaw =
            it.id_type_academic_space ?? it.tipoId ?? it.type_id ?? null;
          let tipoObj = this.tipos.find(
            (t) => t.id_type_academic_space === Number(tipoRaw)
          );
          if (!tipoObj) {
            tipoObj = new TypeAcademicSpace(
              it.type_name ?? it.type ?? '—',
              it.is_active ?? '',
              Number(tipoRaw) || undefined
            );
          }

          // crear AcademicSpace usando el modelo
          const aspace = new AcademicSpace(
            space_name,
            capacity,
            location,
            observation,
            floorObj!,
            stateObj!,
            tipoObj!,
            id_academic_space
          );

          // Construir la vista para la plantilla
          const view: AmbienteView = {
            id: aspace.id_academic_space ?? id_academic_space,
            id_academic_space: aspace.id_academic_space,
            nombre: aspace.space_name,
            tipoId: aspace.type_academic_space?.id_type_academic_space ?? null,
            capacidad: aspace.capacity,
            estado: aspace.state?.name ?? '',
            pisoId: aspace.floor?.id_floor ?? null,
            buildingId: aspace.floor?.building?.id_building ?? null,
            observation: aspace.observation,
            location: aspace.location,
            model: aspace,
          };

          return view;
        });
      },
      error: () => {
        this.ambientes = [];
      },
    });
  }

  private cargarEstados(): void {
    this.stateService.getStates().subscribe({
      next: (res: any) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        this.estados = items.map(
          (it: any, idx: number) =>
            new State(
              it.name ?? '—',
              it.is_active ?? 'A',
              it.id ?? it.id_state ?? idx + 1
            )
        );
      },
      error: () => {
        this.estados = [];
      },
    });
  }

  private cargarPisos(): void {
    // Si aún no tenemos buildings cargados, esperar hasta que se carguen
    if (!this.buildingsLoaded) {
      // reintentar después de un pequeño timeout (simple backoff) para evitar dependencias circulares
      setTimeout(() => this.cargarPisos(), 50);
      return;
    }

    // Para cada building pedimos sus pisos al endpoint específico
    const calls = this.buildings.map((b) =>
      this.buildingService.getFloorByBuilding(b.id_building ?? 0)
    );

    if (calls.length === 0) {
      this.floors = [];
      this.floorsLoaded = true;
      this.tryLoadAmbientesAfterDeps();
      return;
    }

    forkJoin(
      // normalizar llamadas que pueden retornar arrays directos o { data: [...] }
      calls.map(
        (obs) => obs // Observable<Floor[]>
      )
    ).subscribe({
      next: (results: any[]) => {
        const all: Floor[] = [];
        results.forEach((res, idx) => {
          const bld = this.buildings[idx];
          const items = Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res)
            ? res
            : [];
          const mapped = items.map((it: any, j: number) => {
            const id_floor = it.id ?? it.id_floor ?? j + 1;
            const floor_number = Number(it.floor_number ?? 0);
            // construir Floor con referencia al building correspondiente
            let buildingObj: Building;
            if (bld) {
              buildingObj = bld;
            } else {
              const bid = Number(
                it.id_building ?? it.building?.id_building ?? 0
              );
              const bname = it.building?.name ?? '';
              const bactive = it.building?.is_active ?? '';
              buildingObj = new Building(bname, bactive, bid);
            }
            return new Floor(
              floor_number,
              it.is_active ?? '',
              buildingObj,
              id_floor
            );
          });
          all.push(...mapped);
        });
        this.floors = all;
        this.floorsLoaded = true;
        this.tryLoadAmbientesAfterDeps();
      },
      error: () => {
        this.floors = [];
        this.floorsLoaded = true;
        this.tryLoadAmbientesAfterDeps();
      },
    });
  }

  private cargarBuildings(): void {
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
        this.buildingsLoaded = true;
        this.tryLoadAmbientesAfterDeps();
      },
      error: () => {
        this.buildings = [];
        this.buildingsLoaded = true;
        this.tryLoadAmbientesAfterDeps();
      },
    });
  }
  // --- helper: asegurar cargar ambientes tras dependencias ---
  private tryLoadAmbientesAfterDeps(): void {
    if (this.buildingsLoaded && this.floorsLoaded) {
      this.cargarAmbientes();
    }
  }

  // --- Form alta rápida ---
  nuevoNombre = '';
  nuevaObservacion = '';
  nuevaUbicacion = '';
  nuevaCapacidad: number | null = null;
  nuevoTipoId: number | null = null;
  nuevoEstadoId: number | null = null;
  nuevoPisoId: number | null = null;
  nuevoBuildingId: number | null = null;
  private lastBuildingId: number | null = null;
  // filtro para la tabla
  filtroBuildingId: number | null = null;

  // --- Resúmenes (con “últimos 30 días”) ---
  prevTotal30d = 68; // para ~+10% al redondear
  prevDisp30d = 52.6; // para ~-5% al redondear

  // --- Helpers UI ---
  getTipoNombre(id: number | null | undefined): string {
    if (id == null) return '-';
    return this.tipos.find((t) => t.id_type_academic_space === id)?.name ?? '-';
  }

  get totalCapacidad(): number {
    return this.ambientes.reduce((s, a) => s + (a.capacidad ?? 0), 0);
  }

  get totalDisponibles(): number {
    return this.ambientes.filter((a) => a.estado === 'Disponible').length;
  }

  get totalOcupados(): number {
    return this.ambientes.filter((a) => a.estado === 'Ocupado').length;
  }

  get cambioTotalPct(): number {
    return Math.round(
      ((this.totalCapacidad - this.prevTotal30d) / this.prevTotal30d) * 100
    );
  }

  get cambioDispPct(): number {
    return Math.round(
      ((this.totalDisponibles - this.prevDisp30d) / this.prevDisp30d) * 100
    );
  }

  // Mini-barras (altura relativa)
  barAltura(capacidad: number, maxPx = 120): number {
    const max = Math.max(...this.ambientes.map((a) => a.capacidad), 1);
    return Math.max(6, Math.round((capacidad / max) * maxPx));
  }

  barAlturaEstado(valor: number, maxPx = 140): number {
    const max = Math.max(this.totalDisponibles, this.totalOcupados, 1);
    return Math.max(6, Math.round((valor / max) * maxPx));
  }

  // Acciones
  crearAmbiente(): void {
    const nombre = this.nuevoNombre.trim();
    const tipoId = this.nuevoTipoId;
    const estadoId = this.nuevoEstadoId;
    const pisoId = this.nuevoPisoId;
    const capacidad = this.nuevaCapacidad ?? 0;
    const observation = this.nuevaObservacion.trim();
    const location = this.nuevaUbicacion.trim() || this.generarUbicacion();

    if (!nombre || !tipoId || !estadoId || !pisoId) return;

    const body = {
      space_name: nombre,
      observation,
      location,
      capacity: Number(capacidad),
      id_type_academic_space: Number(tipoId),
      id_state: Number(estadoId),
      id_floor: Number(pisoId),
    };

    this.academicSpaceService.createAcademicSpace(body).subscribe({
      next: () => {
        this.cargarAmbientes();
        this.nuevoNombre = '';
        this.nuevaObservacion = '';
        this.nuevaUbicacion = '';
        this.nuevaCapacidad = null;
        this.nuevoTipoId = null;
        this.nuevoEstadoId = null;
        this.nuevoPisoId = null;
        this.nuevoBuildingId = null;
        this.lastBuildingId = null;
      },
      error: () => {},
    });
  }

  editar(a: AmbienteView): void {
    // Rellenar formulario con datos del ambiente seleccionado
    this.nuevoNombre = a.nombre ?? '';
    this.nuevaObservacion = a.observation ?? '';
    this.nuevaCapacidad = a.capacidad ?? null;
    this.nuevoTipoId = a.tipoId ?? null;

    // buscar estado por nombre
    const estadoObj = this.estados.find(
      (s) =>
        s.name?.toString().toLowerCase() ===
        (a.estado ?? '').toString().toLowerCase()
    );
    this.nuevoEstadoId = estadoObj?.id_state ?? null;

    // Determinar buildingId: prefer valor del ambiente, si falta, intentar desde el piso
    let derivedBuilding: number | null = a.buildingId ?? null;
    if (
      (derivedBuilding == null || derivedBuilding === 0) &&
      a.pisoId != null
    ) {
      const piso = this.floors.find((f) => f.id_floor === a.pisoId);
      derivedBuilding = piso?.building?.id_building ?? null;
    }

    // Asignar primero nuevoBuildingId y lastBuildingId para que onFormChange no resetee el piso
    this.nuevoBuildingId = derivedBuilding ?? null;
    this.lastBuildingId = this.nuevoBuildingId;
    this.nuevoPisoId = a.pisoId ?? null;

    // actualizar ubicación dependiente
    this.onFormChange();
  }

  eliminar(a: AmbienteView): void {
    const ok = confirm(`¿Eliminar "${a.nombre}"?`);
    if (!ok) return;
    this.ambientes = this.ambientes.filter((x) => x.id !== a.id);
  }

  // Estilos dinámicos
  getBadgeClases(estado: string) {
    return estado === 'Disponible'
      ? 'bg-lime-100 text-lime-700 ring-1 ring-lime-200'
      : 'bg-amber-100 text-amber-700 ring-1 ring-amber-200';
  }

  trackById = (_: number, it: AmbienteView) => it.id;

  volver(): void {
    this.router.navigate(['/main/env-creation']);
  }

  // --- Helpers de UI dependientes ---
  get floorsFiltrados(): Floor[] {
    if (this.nuevoBuildingId == null) return [];
    const bid = Number(this.nuevoBuildingId);
    return this.floors.filter((p) => p.building?.id_building === bid);
  }

  // Valida que el formulario de creación tenga los campos obligatorios
  get crearAmbienteValido(): boolean {
    const nombre = (this.nuevoNombre || '').trim();
    const tipoId = this.nuevoTipoId;
    const estadoId = this.nuevoEstadoId;
    const pisoId = this.nuevoPisoId;
    return !!nombre && !!tipoId && !!estadoId && !!pisoId;
  }

  // Ambientes filtrados para la tabla (por pabellón si aplica)
  get ambientesFiltrados(): AmbienteView[] {
    if (this.filtroBuildingId == null) return this.ambientes;
    return this.ambientes.filter((a) => a.buildingId === this.filtroBuildingId);
  }

  onFormChange(): void {
    // Filtra los pisos por el pabellón seleccionado
    if (this.nuevoBuildingId != null) {
      const current = Number(this.nuevoBuildingId);
      if (this.lastBuildingId == null || this.lastBuildingId !== current) {
        // al cambiar de pabellón, resetea piso seleccionado
        this.nuevoPisoId = null;
        this.lastBuildingId = current;
      }
    } else {
      // Si no hay pabellón seleccionado, solo resetea selección
      this.nuevoPisoId = null;
      this.lastBuildingId = null;
    }

    this.nuevaUbicacion = this.generarUbicacion();
  }

  private generarUbicacion(): string {
    const buildingName =
      this.buildings.find((b) => b.id_building === this.nuevoBuildingId)
        ?.name ?? '';
    const floorTxt =
      this.floors.find((p) => p.id_floor === this.nuevoPisoId)?.floor_number ??
      '';
    const tipoTxt = (
      this.tipos.find((t) => t.id_type_academic_space === this.nuevoTipoId)
        ?.name ?? ''
    ).toLowerCase();
    const nombre = this.nuevoNombre.trim();
    const partes = [] as string[];
    if (buildingName) partes.push(buildingName);
    if (floorTxt) partes.push(`piso ${floorTxt}`);
    if (tipoTxt || nombre)
      partes.push(`${tipoTxt || 'salón'} ${nombre || ''}`.trim());
    return partes.filter(Boolean).join(', ');
  }
}
