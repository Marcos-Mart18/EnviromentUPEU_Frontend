import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-course-screen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-screen.component.html',
  styleUrls: ['./course-screen.component.css'],
})
export class CourseScreenComponent implements OnInit {
  readonly brand = '#BFC621';
  isChildRouteActive = false;

  cards = [
    {
      key: 'faculty',
      title: 'Crear Facultad',
      desc: 'Registra una nueva facultad y gestiona sus escuelas profesionales asociadas.',
      route: 'faculty',
      cta: 'Ir a Facultades',
      iconPath: 'M4 12l8-8 8 8M6 10v8a2 2 0 002 2h8a2 2 0 002-2v-8',
    },
    {
      key: 'professional-school',
      title: 'Crear Escuela Profesional',
      desc: 'Añade una nueva escuela profesional vinculada a una facultad existente.',
      route: 'professional-school',
      cta: 'Ir a Escuelas Profesionales',
      iconPath: 'M4 12l8-8 8 8M6 10v8a2 2 0 002 2h8a2 2 0 002-2v-8',
    },
    {
      key: 'cycle',
      title: 'Crear Ciclo',
      desc: 'Agrega un nuevo ciclo académico asociado a una escuela profesional.',
      route: 'cycle',
      cta: 'Ir a Ciclos',
      iconPath: 'M4 12l8-8 8 8M6 10v8a2 2 0 002 2h8a2 2 0 002-2v-8',
    },
    {
      key: 'group',
      title: 'Crear Grupo',
      desc: 'Crea un nuevo grupo dentro de un ciclo académico específico.',
      route: 'group',
      cta: 'Ir a Grupos',
      iconPath: 'M4 12l8-8 8 8M6 10v8a2 2 0 002 2h8a2 2 0 002-2v-8',
    },
    {
      key: 'course',
      title: 'Crear Curso',
      desc: 'Registra un nuevo curso y asignalo a un grupo académico.',
      route: 'course',
      cta: 'Ir a Cursos',
      iconPath: 'M4 12l8-8 8 8M6 10v8a2 2 0 002 2h8a2 2 0 002-2v-8',
    },
    {
      key: 'teacher',
      title: 'Crear Docente',
      desc: 'Añade un nuevo docente al sistema y gestiona sus asignaciones de cursos.',
      route: 'teacher',
      cta: 'Ir a Docentes',
      iconPath: 'M4 12l8-8 8 8M6 10v8a2 2 0 002 2h8a2 2 0 002-2v-8',
    },
    {
      key: 'course-type',
      title: 'Crear Tipo de Curso',
      desc: 'Define nuevos tipos de cursos para categorizar y organizar la oferta académica.',
      route: 'course-type',
      cta: 'Ir a Tipos de Curso',
      iconPath: 'M4 12l8-8 8 8M6 10v8a2 2 0 002 2h8a2 2 0 002-2v-8',
    },
    {
      key: 'plan',
      title: 'Crear Plan de Estudios',
      desc: 'Establece nuevos planes de estudios para las diferentes carreras y programas académicos.',
      route: 'plan',
      cta: 'Ir a Planes de Estudios',
      iconPath: 'M4 12l8-8 8 8M6 10v8a2 2 0 002 2h8a2 2 0 002-2v-8',
    },
  ];
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.checkChildRoute();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkChildRoute();
      });
  }

  checkChildRoute() {
    this.isChildRouteActive = this.route.children.length > 0;
  }

  go(route: string) {
    if (!route) return;
    this.router.navigate([route], { relativeTo: this.route });
  }
}
