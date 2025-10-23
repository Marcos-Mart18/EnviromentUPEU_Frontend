export class Building {
  id_building?: number;
  name: string;
  is_active: string;

  constructor(name: string, is_active: string, id_building?: number) {
    this.name = name;
    this.is_active = is_active;
    if (id_building) {
      this.id_building = id_building;
    }
  }
}
