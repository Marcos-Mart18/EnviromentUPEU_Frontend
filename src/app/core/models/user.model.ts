export interface UserProfileDTO {
  id: number;
  names: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dob: string; // YYYY-MM-DD
  isActive: boolean;
  profilePicture?: string;
}

export interface CreateUserProfileDTO {
  names: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dob: string; // YYYY-MM-DD
  isActive: boolean;
}

export interface UpdateUserProfileDTO {
  names?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  dob?: string; // YYYY-MM-DD
  isActive?: boolean;
}
