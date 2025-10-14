import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Faculty {
  id: string;
  name: string;
}

interface School {
  id: string;
  name: string;
  facultyId: string;
}

interface Course {
  id: string;
  name: string;
  school: string;
  mode: string;
  cycle: number;
  status?: 'highlighted' | 'selected' | 'normal';
}

@Component({
  selector: 'app-carga-academica',
  imports: [CommonModule, FormsModule],
  templateUrl: './carga-academica.component.html',
  styleUrl: './carga-academica.component.css'
})
export class CargaAcademicaComponent implements OnInit {
  selectedFaculty = '';
  selectedSchool = '';
  showUploadModal = false;
  showSuccessModal = false;
  isUploading = false;
  uploadProgress = 0;

  faculties: Faculty[] = [
    { id: '1', name: 'Facultad de Ingeniería y Arquitectura' },
    { id: '2', name: 'Facultad de Ciencias Humanas' },
    { id: '3', name: 'Facultad de Teología' },
    { id: '4', name: 'Facultad de Salud' }
  ];

  schools: School[] = [
    { id: '1', name: 'Ingeniería de Sistemas', facultyId: '1' },
    { id: '2', name: 'Ingeniería Civil', facultyId: '1' },
    { id: '3', name: 'Ingeniería Ambiental', facultyId: '1' },
    { id: '4', name: 'Psicología', facultyId: '2' },
    { id: '5', name: 'Educación', facultyId: '2' },
    { id: '6', name: 'Teología', facultyId: '3' },
    { id: '7', name: 'Medicina', facultyId: '4' },
    { id: '8', name: 'Enfermería', facultyId: '4' }
  ];

  ciclo1Courses: Course[] = [];
  ciclo2Courses: Course[] = [];

  ngOnInit() {
    // Initialize with some default data
    this.loadSampleData();
  }

  onFacultyChange() {
    this.selectedSchool = '';
    this.ciclo1Courses = [];
    this.ciclo2Courses = [];
  }

  onSchoolChange() {
    if (this.selectedSchool) {
      this.loadCoursesForSchool(this.selectedSchool);
    }
  }

  loadCoursesForSchool(schoolId: string) {
    // Sample data for Psicología (School ID 4)
    if (schoolId === '4') {
      this.ciclo1Courses = [
        { id: '1', name: 'Comunicación Oral y Escrita', school: 'EP Psicología', mode: 'Regular', cycle: 1, status: 'highlighted' },
        { id: '2', name: 'Formación Cristiana I', school: 'EP Psicología', mode: 'Regular', cycle: 1, status: 'highlighted' },
        { id: '3', name: 'Fundamentos de la Psicología', school: 'EP Psicología', mode: 'Regular', cycle: 1 },
        { id: '4', name: 'Fundamentos de Matemática', school: 'EP Psicología', mode: 'Regular', cycle: 1 },
        { id: '5', name: 'Procesos Cognitivos', school: 'EP Psicología', mode: 'Regular', cycle: 1 },
        { id: '6', name: 'Salud y Cultura Física I', school: 'EP Psicología', mode: 'Regular', cycle: 1 },
        { id: '7', name: 'Taller de Habilidades Blandas I - GP 1', school: 'EP Psicología', mode: 'Regular', cycle: 1 }
      ];

      this.ciclo2Courses = [
        { id: '8', name: 'Entrevista y Observación Conductual - Teoría G1', school: 'EP Psicología', mode: 'Regular', cycle: 2 },
        { id: '9', name: 'Entrevista y Observación Conductual - P1 - G1', school: 'EP Psicología', mode: 'Regular', cycle: 2 },
        { id: '10', name: 'Entrevista y Observación Conductual - P2 - G1', school: 'EP Psicología', mode: 'Regular', cycle: 2 },
        { id: '11', name: 'Entrevista y Observación Conductual - P3 - G1', school: 'EP Psicología', mode: 'Regular', cycle: 2 },
        { id: '12', name: 'Entrevista y Observación Conductual - Teoría G2', school: 'EP Psicología', mode: 'Regular', cycle: 2, status: 'selected' },
        { id: '13', name: 'Entrevista y Observación Conductual - P1 - G2', school: 'EP Psicología', mode: 'Regular', cycle: 2, status: 'selected' },
        { id: '14', name: 'Entrevista y Observación Conductual - P2 - G2', school: 'EP Psicología', mode: 'Regular', cycle: 2, status: 'selected' },
        { id: '15', name: 'Entrevista y Observación Conductual - P3 - G2', school: 'EP Psicología', mode: 'Regular', cycle: 2, status: 'selected' },
        { id: '16', name: 'Formación Cristiana II', school: 'EP Psicología', mode: 'Regular', cycle: 2, status: 'highlighted' },
        { id: '17', name: 'Formación Cristiana II', school: 'EP Psicología', mode: 'Regular', cycle: 2, status: 'highlighted' },
        { id: '18', name: 'Gestión para el aprendizaje y la Investigación', school: 'EP Psicología', mode: 'Regular', cycle: 2, status: 'normal' },
        { id: '19', name: 'Gestión para el aprendizaje y la Investigación', school: 'EP Psicología', mode: 'Regular', cycle: 2, status: 'normal' },
        { id: '20', name: 'Neuroanatomía y Psicofisiología - Teoría G1', school: 'EP Psicología', mode: 'Regular', cycle: 2 },
        { id: '21', name: 'Neuroanatomía y Psicofisiología - P1 - G1', school: 'EP Psicología', mode: 'Regular', cycle: 2 },
        { id: '22', name: 'Neuroanatomía y Psicofisiología - P2 - G1', school: 'EP Psicología', mode: 'Regular', cycle: 2 }
      ];
    } else {
      // Default empty courses for other schools
      this.ciclo1Courses = [];
      this.ciclo2Courses = [];
    }
  }

  loadSampleData() {
    // Set default selections to show the example
    this.selectedFaculty = '4'; // Facultad de Salud
    this.selectedSchool = '4'; // Psicología
    this.loadCoursesForSchool('4');
  }

  getCourseRowClass(course: Course): string {
    switch (course.status) {
      case 'highlighted':
        return 'bg-green-100';
      case 'selected':
        return 'bg-orange-100';
      case 'normal':
        return 'bg-yellow-100';
      default:
        return '';
    }
  }

  downloadTemplate() {
    // Simulate template download
    console.log('Descargando plantilla...');
    // Here you would implement actual file download
  }

  openUploadModal() {
    this.showUploadModal = true;
  }

  closeUploadModal() {
    this.showUploadModal = false;
    this.isUploading = false;
    this.uploadProgress = 0;
  }

  selectFile() {
    // Simulate file selection and upload process
    this.isUploading = true;
    this.uploadProgress = 0;
    
    // Simulate upload progress
    const interval = setInterval(() => {
      this.uploadProgress += Math.random() * 15;
      if (this.uploadProgress >= 100) {
        this.uploadProgress = 100;
        clearInterval(interval);
        
        // Close upload modal and show success modal after a delay
        setTimeout(() => {
          this.closeUploadModal();
          this.showSuccessModal = true;
        }, 500);
      }
    }, 200);
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    // Here you could redirect or refresh the data
  }

  viewPreviousVersions() {
    console.log('Ver versiones anteriores...');
    // Here you would implement the previous versions functionality
  }
}