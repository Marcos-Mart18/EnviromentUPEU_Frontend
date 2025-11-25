import { ProfessionalSchool } from './professional-school';

export class Cycle {
  idCycle?: number;
  name: string;
  professionalSchool: ProfessionalSchool;

  constructor(
    name: string,
    professionalSchool: ProfessionalSchool,
    idCycle?: number
  ) {
    if (idCycle) {
      this.idCycle = idCycle;
    }
    this.name = name;
    this.professionalSchool = professionalSchool;
  }
}
