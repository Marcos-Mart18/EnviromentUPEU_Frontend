import { Cycle } from './cycle';

export class Group {
  idGroup?: number;
  groupNumber: number;
  capacity: number;
  cycle: Cycle;

  constructor(
    groupNumber: number,
    capacity: number,
    cycle: Cycle,
    idGroup?: number
  ) {
    if (idGroup) {
      this.idGroup = idGroup;
    }
    this.groupNumber = groupNumber;
    this.capacity = capacity;
    this.cycle = cycle;
  }
}
