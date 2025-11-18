import { CourseType } from './course-type';
import { Group } from './group';
import { Plan } from './plan';

export class Course {
  idCourse?: number;
  name: string;
  code: string;
  description: string;
  duration: number;
  practicalHours: number;
  theoreticalHours: number;
  totalHours: number;
  courseType: CourseType;
  group: Group;
  plan: Plan;

  constructor(
    name: string,
    code: string,
    description: string,
    duration: number,
    practicalHours: number,
    theoreticalHours: number,
    totalHours: number,
    courseType: CourseType,
    group: Group,
    plan: Plan,
    idCourse?: number
  ) {
    if (idCourse) {
      this.idCourse = idCourse;
    }
    this.name = name;
    this.code = code;
    this.description = description;
    this.duration = duration;
    this.practicalHours = practicalHours;
    this.theoreticalHours = theoreticalHours;
    this.totalHours = totalHours;
    this.courseType = courseType;
    this.group = group;
    this.plan = plan;
  }
}
