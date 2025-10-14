import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-env-screen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './env-screen.component.html',
  styleUrls: ['./env-screen.component.css'],
})
export class EnvScreenComponent {
  // Color de marca
  readonly brand = '#BFC621';

  // Config de las tarjetas
  cards = [
    {
      key: 'ambiente',
      title: 'Crear Ambiente',
      desc:
        'Registra un nuevo ambiente con su tipo asociado y gestiona sus recursos y disponibilidad.',
      route: 'env-creation/environment', // ajusta a tu ruta real
      cta: 'Ir a Ambientes',
      iconPath:
        'M4 12l8-8 8 8M6 10v8a2 2 0 002 2h8a2 2 0 002-2v-8',
    },
    {
      key: 'tipo',
      title: 'Crear Tipo de Ambiente',
      desc:
        'Define categorías como Sala de Reuniones, Laboratorio o Almacenamiento para usarlas luego.',
      route: 'env-creation/type-environment', // ajusta a tu ruta real
      cta: 'Ir a Tipos',
      iconPath:
        'M4 6h16M4 12h16M4 18h10', // icono "lista"
    },
  ];

  constructor(private router: Router) {}

  go(route: string) {
    if (!route) return;
    this.router.navigateByUrl(route);
  }
}
