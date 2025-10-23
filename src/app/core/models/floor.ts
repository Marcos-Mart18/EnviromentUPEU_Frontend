import { Building } from './building';

export class Floor {
  id_floor?: number;
  floor_number: number;
  is_active: string;
  building: Building;

  constructor(
    floor_number: number,
    is_active: string,
    building: Building,
    id_floor?: number
  ) {
    this.floor_number = floor_number;
    this.is_active = is_active;
    this.building = building;
    if (id_floor) {
      this.id_floor = id_floor;
    }
  }
}
