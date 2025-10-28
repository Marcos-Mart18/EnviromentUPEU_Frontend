import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-resource-screen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resource-screen.component.html',
  styleUrls: ['./resource-screen.component.css'],
})
export class ResourceScreenComponent implements OnInit {
  readonly brand = '#BFC621';
  isChildRouteActive = false;
  cards = [
    {
      title: 'Crear Recurso',
      desc: 'Registra equipos y materiales y asígnalos a un ambiente.',
      route: 'resources',
      icon: 'M4 6h16M4 12h16M4 18h16',
      cta: 'Ir a Recursos',
    },
    {
      title: 'Tipos de Recurso',
      desc: 'Define categorías y tipos (p. ej. Portátil, Proyector).',
      route: 'types',
      icon: 'M4 6h16M8 10h12M8 14h12',
      cta: 'Gestionar Tipos',
    },
    {
      title: 'Estados',
      desc: 'Crea estados como Disponible, En uso, Mantenimiento.',
      route: 'states',
      icon: 'M12 3v18M3 12h18',
      cta: 'Gestionar Estados',
    },
    {
      title: 'Categorías',
      desc: 'Gestiona las categorías de recursos.',
      route: 'categories',
      icon: 'M4 6h16M4 12h16M4 18h16',
      cta: 'Gestionar Categorías',
    },
  ];
  
  constructor(private router: Router, private route: ActivatedRoute) {}
  
  ngOnInit() {
    // Detectar si hay rutas hijas activas
    this.checkChildRoute();
    
    // Escuchar cambios de navegación
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkChildRoute();
      });
  }

  checkChildRoute() {
    // Verificar si hay hijos activos en la ruta
    this.isChildRouteActive = this.route.children.length > 0;
  }
  
  go(r: string) { 
    if (!r) return;
    // Navegación relativa desde la ruta actual
    this.router.navigate([r], { relativeTo: this.route });
  }
}
