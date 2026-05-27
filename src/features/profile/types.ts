export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateProfilePayload = {
  name?: string;
  phone?: string;
  address?: string;
};

export type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};
