export class State {
  id_state?: number;
  name: string;
  is_active: string;

  constructor(name: string, is_active: string, id_state?: number) {
    this.name = name;
    this.is_active = is_active;
    if (id_state) {
      this.id_state = id_state;
    }
  }
}
