import { Type } from '@angular/core';
import { Floor } from './floor';
import { State } from './state';
import { TypeAcademicSpace } from './type-academic-space';

export class AcademicSpace {
  id_academic_space?: number;
  space_name: string;
  capacity: number;
  location: string;
  observation: string;
  floor: Floor;
  state: State;
  type_academic_space: TypeAcademicSpace;

  constructor(
    space_name: string,
    capacity: number,
    location: string,
    observation: string,
    floor: Floor,
    state: State,
    type_academic_space: TypeAcademicSpace,
    id_academic_space?: number
  ) {
    this.space_name = space_name;
    this.capacity = capacity;
    this.location = location;
    this.observation = observation;
    this.floor = floor;
    this.state = state;
    this.type_academic_space = type_academic_space;
    if (id_academic_space) {
      this.id_academic_space = id_academic_space;
    }
  }
}
