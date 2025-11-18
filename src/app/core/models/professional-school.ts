import { Faculty } from './faculty';

export class ProfessionalSchool {
  idProfessionalSchool?: number;
  name: string;
  faculty: Faculty;

  constructor(name: string, faculty: Faculty, idProfessionalSchool?: number) {
    if (idProfessionalSchool) {
      this.idProfessionalSchool = idProfessionalSchool;
    }
    this.name = name;
    this.faculty = faculty;
  }
}
