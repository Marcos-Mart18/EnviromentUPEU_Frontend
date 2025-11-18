import { Teacher } from './teacher';

export class CourseAssignment {
  idCourseAssignment?: number;
  teacher: Teacher;

  constructor(teacher: Teacher, idCourseAssignment?: number) {
    if (idCourseAssignment) {
      this.idCourseAssignment = idCourseAssignment;
    }
    this.teacher = teacher;
  }
}
