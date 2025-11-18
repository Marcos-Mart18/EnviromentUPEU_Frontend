export class Plan {
  idPlan?: number;
  name: string;

  constructor(name: string, idPlan?: number) {
    if (idPlan) {
      this.idPlan = idPlan;
    }
    this.name = name;
  }
}
