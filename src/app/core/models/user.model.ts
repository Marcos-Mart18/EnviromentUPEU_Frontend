import { Role } from './auth.model';

export interface UserDTO {
  id: number;
  username: string;
  isActive: boolean;
  userProfileId: number;
  roles: Role[];
}

export interface CreateUserDTO {
  username: string;
  password: string;
  userProfileId: number;
  roles?: number[]; // role IDs if backend supports
}

export interface UpdateUserDTO {
  username?: string;
  password?: string;
  isActive?: boolean;
  userProfileId?: number;
  roles?: number[]; // role IDs if backend supports
}
