import { ResourceType } from './resource-type.model';
import { ResourceState } from './resource-state.model';

export class Resource {
  idResource?: number;
  code: string;
  stock?: number;
  resourcePhotoUrl?: string;
  observation?: string;
  idResourceType?: number;
  idState?: number;
  resourceType?: ResourceType;
  state?: ResourceState;

  constructor(
    code: string,
    stock?: number,
    resourcePhotoUrl?: string,
    observation?: string,
    idResourceType?: number,
    idState?: number,
    idResource?: number,
    resourceType?: ResourceType,
    state?: ResourceState
  ) {
    this.code = code;
    this.stock = stock;
    this.resourcePhotoUrl = resourcePhotoUrl;
    this.observation = observation;
    this.idResourceType = idResourceType;
    this.idState = idState;
    if (idResource) {
      this.idResource = idResource;
    }
    if (resourceType) {
      this.resourceType = resourceType;
    }
    if (state) {
      this.state = state;
    }
  }
}
