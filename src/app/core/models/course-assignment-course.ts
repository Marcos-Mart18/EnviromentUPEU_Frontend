import { Course } from './course';
import { CourseAssignment } from './course-assignment';

export class CourseAssignmentCourse {
  idCourseAssignmentCourse?: number;
  courseAssignment: CourseAssignment;
  course: Course;
  constructor(
    courseAssignment: CourseAssignment,
    course: Course,
    idCourseAssignmentCourse?: number
  ) {
    if (idCourseAssignmentCourse) {
      this.idCourseAssignmentCourse = idCourseAssignmentCourse;
    }
    this.courseAssignment = courseAssignment;
    this.course = course;
  }
}
