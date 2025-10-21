import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-resource-screen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resource-screen.component.html',
  styleUrls: ['./resource-screen.component.css'],
})
export class ResourceScreenComponent {
  readonly brand = '#BFC621';
  cards = [
    {
      title: 'Crear Recurso',
      desc: 'Registra equipos y materiales y asígnalos a un ambiente.',
      route: '/res-creation/resources',
      icon: 'M4 6h16M4 12h16M4 18h16',
      cta: 'Ir a Recursos',
    },
    {
      title: 'Tipos de Recurso',
      desc: 'Define categorías y tipos (p. ej. Portátil, Proyector).',
      route: '/res-creation/types',
      icon: 'M4 6h16M8 10h12M8 14h12',
      cta: 'Gestionar Tipos',
    },
    {
      title: 'Estados',
      desc: 'Crea estados como Disponible, En uso, Mantenimiento.',
      route: '/res-creation/states',
      icon: 'M12 3v18M3 12h18',
      cta: 'Gestionar Estados',
    },
  ];
  constructor(private router: Router) {}
  go(r: string) { this.router.navigateByUrl(r); }
}
