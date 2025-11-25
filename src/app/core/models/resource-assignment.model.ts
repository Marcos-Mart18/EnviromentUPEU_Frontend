import { Resource } from './resource.model';
import { ResourceType } from './resource-type.model';
import { ResourceState } from './resource-state.model';

// Request used for create/update
export interface ResourceAssignmentRequest {
  idAcademicSpace: number;
  idResource: number;
}

// Standard CRUD response
export interface ResourceAssignmentResponse {
  idResourceAssignment: number;
  idAcademicSpace: number;
  resource: Resource;
}

// Optional helper types if needed by UI (coming from existing models)
export type RAResourceType = ResourceType;
export type RAResourceState = ResourceState;

// Details response (special GET)
export interface ResourceAssignmentDetailsResponse {
  idResourceAssignment: number;
  idAcademicSpace: number;

  resourceCode?: string;
  resourceStock?: number;
  resourcePhotoUrl?: string | null;
  resourceStateName?: string | null;
  resourceTypeName?: string | null;

  academicSpaceId?: number | null;
  spaceName?: string | null;
  capacity?: number | null;
  typeAcademicSpaceName?: string | null;
  floorNumber?: number | null;
  buildingName?: string | null;
}
