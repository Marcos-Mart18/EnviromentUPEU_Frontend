export class CategoryResource {
  idCategoryResource?: number;
  name: string;
  isActive: boolean;

  constructor(name: string, isActive: boolean, idCategoryResource?: number) {
    this.name = name;
    this.isActive = isActive;
    if (idCategoryResource) {
      this.idCategoryResource = idCategoryResource;
    }
  }
}
