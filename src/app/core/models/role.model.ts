export interface RoleDTO {
  id: number;
  name: string;
  isActive: boolean;
}

export interface CreateRoleDTO {
  name: string;
  isActive: boolean;
}

export interface UpdateRoleDTO {
  name?: string;
  isActive?: boolean;
}
