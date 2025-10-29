import { CategoryResource } from './category-resource.model';

export class ResourceType {
  idResourceType?: number;
  name: string;
  isActive: boolean;
  idCategoryResource?: number;
  categoryResource?: CategoryResource;

  constructor(
    name: string,
    isActive: boolean,
    idResourceType?: number,
    categoryResource?: CategoryResource,
    idCategoryResource?: number
  ) {
    this.name = name;
    this.isActive = isActive;
    if (idResourceType) {
      this.idResourceType = idResourceType;
    }
    if (categoryResource) {
      this.categoryResource = categoryResource;
    }
    if (idCategoryResource) {
      this.idCategoryResource = idCategoryResource;
    }
  }
}
