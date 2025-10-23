export class TypeAcademicSpace {
  id_type_academic_space?: number;
  name: string;
  is_active: string;

  constructor(
    name: string,
    is_active: string,
    id_type_academic_space?: number
  ) {
    this.name = name;
    this.is_active = is_active;
    if (id_type_academic_space) {
      this.id_type_academic_space = id_type_academic_space;
    }
  }
}
