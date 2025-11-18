export class Faculty {
  idFaculty?: number;
  name: string;

  constructor(name: string, idFaculty?: number) {
    if (idFaculty) {
      this.idFaculty = idFaculty;
    }
    this.name = name;
  }
}
