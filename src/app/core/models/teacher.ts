export class Teacher {
  idTeacher?: number;
  name: string;
  lastName: string;
  email: string;
  constructor(
    name: string,
    lastName: string,
    email: string,
    idTeacher?: number
  ) {
    if (idTeacher) {
      this.idTeacher = idTeacher;
    }
    this.name = name;
    this.lastName = lastName;
    this.email = email;
  }
}
