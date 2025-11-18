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

export interface AuthUserDTO {
  id: number;
  username: string;
  isActive: boolean;
  userProfileId: number;
  roles: Role[];
}

export interface CreateAuthUserRequest {
  username: string;
  password: string;
  userProfileId: number;
}

export interface UpdateAuthUserRequest {
  username?: string;
  password?: string;
  isActive?: boolean;
  userProfileId?: number;
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

export interface RegisterRequest {
  username: string;
  password: string;
  userProfileId: number;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface LoginResponseSnake {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginRememberResponseSnake {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface RefreshResponseSnake {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface LogoutRequestSnake {
  access_token: string;
  refresh_token?: string;
}
