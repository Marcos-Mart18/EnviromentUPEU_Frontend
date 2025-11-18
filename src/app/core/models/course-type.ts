export class CourseType {
  idCourseType?: number;
  name: string;

  constructor(name: string, idCourseType?: number) {
    if (idCourseType) {
      this.idCourseType = idCourseType;
    }
    this.name = name;
  }
}
