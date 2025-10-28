import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterModule,
  ActivatedRoute,
  NavigationEnd,
} from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-env-screen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './env-screen.component.html',
  styleUrls: ['./env-screen.component.css'],
})
export class EnvScreenComponent implements OnInit {
  // Color de marca
  readonly brand = '#BFC621';
  isChildRouteActive = false;

  // Config de las tarjetas
  cards = [
    {
      key: 'ambiente',
      title: 'Crear Ambiente',
      desc: 'Registra un nuevo ambiente con su tipo asociado y gestiona sus recursos y disponibilidad.',
      route: 'environment', // ruta relativa
      cta: 'Ir a Ambientes',
      iconPath: 'M4 12l8-8 8 8M6 10v8a2 2 0 002 2h8a2 2 0 002-2v-8',
    },
    {
      key: 'tipo',
      title: 'Crear Tipo de Ambiente',
      desc: 'Define categorías como Sala de Reuniones, Laboratorio o Almacenamiento para usarlas luego.',
      route: 'type-environment', // ruta relativa
      cta: 'Ir a Tipos',
      iconPath: 'M4 6h16M4 12h16M4 18h10', // icono "lista"
    },
    {
      key: 'building',
      title: 'Pabellones',
      desc: 'Gestiona los pabellones (buildings).',
      route: 'buildings',
      cta: 'Ir a Pabellones',
      iconPath: 'M4 6h16M4 12h16M4 18h10',
    },
    {
      key: 'state',
      title: 'Estados',
      desc: 'Gestiona los estados de ambientes.',
      route: 'states',
      cta: 'Ir a Estados',
      iconPath: 'M4 6h16M4 12h16M4 18h10',
    },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Detectar si hay rutas hijas activas
    this.checkChildRoute();

    // Escuchar cambios de navegación
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkChildRoute();
      });
  }

  checkChildRoute() {
    // Verificar si hay hijos activos en la ruta
    this.isChildRouteActive = this.route.children.length > 0;
  }

  go(route: string) {
    if (!route) return;
    // Navegación relativa desde la ruta actual
    this.router.navigate([route], { relativeTo: this.route });
  }
}
