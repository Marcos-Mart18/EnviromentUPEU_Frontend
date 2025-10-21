export interface LoginRequest {
  username: string;
  password: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  isActive: boolean;
  userProfileId: number;
  roles: Role[];
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface LogoutRequest {
  refreshToken: string;
}
