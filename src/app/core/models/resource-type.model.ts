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
    idCategoryResource?: number,
    idResourceType?: number,
    categoryResource?: CategoryResource
  ) {
    this.name = name;
    this.isActive = isActive;
    this.idCategoryResource = idCategoryResource;
    if (idResourceType) {
      this.idResourceType = idResourceType;
    }
    if (categoryResource) {
      this.categoryResource = categoryResource;
    }
  }
}
