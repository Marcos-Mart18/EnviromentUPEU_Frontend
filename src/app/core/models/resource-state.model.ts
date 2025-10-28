export class ResourceState {
  idState?: number;  // Mantener como number, porque en JS no tenemos un tipo Long.
  name: string;
  isActive: boolean;

  constructor(name: string, isActive: boolean, idState?: number) {
    this.name = name;
    this.isActive = isActive;
    if (idState) {
      this.idState = idState;
    }
  }
}
